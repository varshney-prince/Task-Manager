import React, { useState, useEffect, useCallback } from 'react';
import { Plus, PlusCircle, Settings, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { ManageCategoriesModal } from '../components/ManageCategoriesModal';
import { toast } from 'sonner';

interface DashboardViewProps {
  onQuickFocus?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onQuickFocus }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectTab, setActiveProjectTab] = useState<string>('All Projects');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tasksRes, projectsRes, categoriesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects'),
        fetch('/api/categories')
      ]);
      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Group tasks by category and combine with fetched categories
  const taskCountsByCategory = tasks.reduce((acc: any, task) => {
    const cat = task.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryList = categories.map(cat => ({
    label: cat.name,
    count: taskCountsByCategory[cat.name] || 0,
    color: cat.color
  }));

  // Add Uncategorized if there are tasks without a matching category
  const uncategorizedCount = tasks.filter(t => !categories.some(c => c.name === t.category)).length;
  if (uncategorizedCount > 0) {
    categoryList.push({
      label: 'Uncategorized',
      count: uncategorizedCount,
      color: 'bg-outline'
    });
  }

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !task.isCompleted })
      });

      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
        toast.success(`Task marked as ${!task.isCompleted ? 'completed' : 'pending'}`);
      } else {
        toast.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      toast.error('An error occurred while updating task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('An error occurred while deleting task');
    }
  };

  const duplicateTask = async (task: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${task.title} (Copy)`,
          description: task.description,
          category: task.category,
          priority: task.priority,
          project: task.project,
          time: task.time,
          status: 'Upcoming'
        }),
      });

      if (response.ok) {
        fetchData();
        toast.success('Task duplicated successfully');
      } else {
        toast.error('Failed to duplicate task');
      }
    } catch (error) {
      console.error('Failed to duplicate task:', error);
      toast.error('An error occurred while duplicating task');
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTaskModalOpen(false);
    // Add a small delay before clearing the editing task to prevent flickering during close animation
    setTimeout(() => setEditingTask(null), 300);
  };

  const filteredTasks = activeProjectTab === 'All Projects' 
    ? tasks 
    : tasks.filter(t => t.project === activeProjectTab);

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <section className="mb-12 flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-secondary-container font-semibold mb-2 block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h2 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight leading-tight">Your Daily Ritual</h2>
          <p className="text-secondary mt-4 font-body text-lg leading-relaxed">
            {isLoading ? 'Synchronizing your architectural ventures...' : 
             tasks.length === 0 ? 'No tasks defined yet. Start by creating a new ritual.' :
             `You have ${pendingTasks.length} tasks remaining today. Focus on clarity.`}
          </p>
        </motion.div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${isEditing ? 'bg-primary text-white' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
          >
            {isEditing ? 'Done Editing' : 'Edit List'}
          </button>
          <button 
            onClick={() => onQuickFocus ? onQuickFocus() : setIsAddTaskModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Zap size={16} fill="currentColor" />
            Quick Focus
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 mb-2 pb-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveProjectTab('All Projects')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeProjectTab === 'All Projects' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              All Projects
            </button>
            {projects.slice(0, 4).map((project) => (
              <button 
                key={project.id}
                onClick={() => setActiveProjectTab(project.name)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeProjectTab === project.name ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                {project.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 text-center text-outline font-medium animate-pulse">
                Architecting your dashboard...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline/40">
                  <Target size={32} />
                </div>
                <p className="text-outline font-medium">Your ritual list is empty.</p>
              </div>
            ) : (
              filteredTasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard 
                    task={task} 
                    onToggle={toggleTaskCompletion} 
                    isEditing={isEditing}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                    onDuplicate={duplicateTask}
                  />
                </motion.div>
              ))
            )}
            
            {!isLoading && (
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="w-full border-2 border-dashed border-outline-variant/30 p-6 rounded-2xl flex items-center justify-center gap-3 text-secondary hover:bg-surface-container-low transition-all group"
              >
                <PlusCircleIcon className="group-hover:scale-110 transition-transform" />
                <span className="font-bold font-headline">Add another entry to your ritual</span>
              </button>
            )}
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10">
              <h4 className="font-headline text-xl font-bold mb-6">Daily Progress</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-extrabold">{completionRate}%</span>
                <span className="text-primary-fixed-dim text-sm font-medium mb-1">of goals met</span>
              </div>
              <div className="w-full bg-primary-container h-2 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-on-tertiary-container h-full rounded-full shadow-[0_0_12px_rgba(0,153,217,0.5)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-container/40 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-primary-fixed-dim font-bold uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-xl font-bold">{completedTasks.length}</p>
                </div>
                <div className="bg-primary-container/40 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-primary-fixed-dim font-bold uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-xl font-bold">{pendingTasks.length}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-on-tertiary-container/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/5">
            <h4 className="font-headline text-sm font-bold mb-4 flex items-center justify-between">
              Categories
              <button 
                onClick={() => setIsManageCategoriesModalOpen(true)}
                className="p-1 text-secondary hover:text-primary hover:bg-surface-container-low rounded transition-colors"
                title="Manage Categories"
              >
                <Settings size={14} />
              </button>
            </h4>
            <div className="space-y-2">
              {categoryList.length === 0 ? (
                <p className="text-xs text-outline italic p-2">No categories yet</p>
              ) : (
                categoryList.map((cat) => (
                  <div key={cat.label} className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded group-hover:bg-primary group-hover:text-white transition-all">
                      {cat.count < 10 ? `0${cat.count}` : cat.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/5">
            <h4 className="font-headline text-base font-bold mb-6 text-on-surface">Focus Sessions</h4>
            <div className="flex items-center justify-between mb-6">
              {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isToday = i === 0;
                return (
                  <div key={day} className="text-center flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-outline/60'}`}>{day}</span>
                    <span className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-[#0F172A] text-white shadow-md' : 'text-outline/80'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="p-5 bg-surface-container-low rounded-2xl border-l-[3px] border-primary shadow-sm">
              <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-2">Architectural Mastery</p>
              <p className="text-[15px] font-bold leading-snug text-on-surface mb-3 pr-4">Your data is synchronized with Excel</p>
              <p className="text-xs text-secondary flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-secondary/70" /> Local Data Source Active
              </p>
            </div>
          </div>
        </aside>
      </div>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={handleCloseModal} 
        onTaskAdded={fetchData} 
        initialTask={editingTask}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesModalOpen}
        onClose={() => setIsManageCategoriesModalOpen(false)}
        onCategoriesUpdated={fetchData}
      />
    </div>
  );
};

const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
