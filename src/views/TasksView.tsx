import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Share2, 
  FolderOpen, 
  Check, 
  ChevronDown, 
  MoreVertical,
  Lightbulb,
  Layers,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isCompleted: !currentStatus,
          status: !currentStatus ? 'Completed' : 'In-Progress'
        }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-on-secondary-container font-label font-medium text-sm tracking-wider uppercase mb-2 block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h2 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            Focus on the <span className="text-on-tertiary-container italic">Essential</span>.
          </h2>
        </motion.div>
        
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_12px_32px_rgba(12,20,39,0.05)] border border-outline-variant/10 flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center text-on-tertiary-fixed-variant">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-label text-outline font-medium">Completed</p>
            <p className="text-lg font-headline font-bold">{completedTasksCount} / {tasks.length}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden h-[320px] flex flex-col justify-between shadow-xl">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-headline font-bold mb-1">Weekly Velocity</h3>
                <p className="text-primary-fixed-dim text-sm">Task performance ritual</p>
              </div>
              <button 
                onClick={fetchTasks}
                className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-headline font-extrabold">{completedTasksCount}</span>
                <span className="text-primary-fixed-dim font-medium mb-1.5">tasks completed</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/5">
                <div className="w-8 h-8 rounded-full bg-on-tertiary-container flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <span className="text-xs font-medium">{completionRate}% completion rate</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-tertiary-container rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl space-y-4 border border-outline-variant/5">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold">Daily Target</h3>
              <span className="text-xs font-bold text-on-tertiary-container">{completionRate}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                className="h-full bg-tertiary rounded-full"
              />
            </div>
            <p className="text-xs text-on-secondary-container font-medium">
              {completionRate === 100 ? 'All rituals completed! Full clarity achieved.' : 'Keep going. Clarity is within reach.'}
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_12px_32px_rgba(12,20,39,0.05)] border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-headline font-bold">Current Focus</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-outline">
                  <Share2 size={20} />
                </button>
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-outline">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 text-center text-outline font-medium animate-pulse">
                  Architecting your focus...
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline/40">
                    <Target size={32} />
                  </div>
                  <p className="text-outline font-medium">No tasks found in your current data source.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem 
                    key={task.id}
                    title={task.title}
                    project={task.project}
                    description={task.description}
                    status={task.status}
                    time={task.time}
                    category={task.category}
                    priority={task.priority}
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTaskCompletion(task.id, task.isCompleted)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="mt-12 max-w-md">
            <div className="p-6 bg-tertiary-container text-on-tertiary-fixed-variant rounded-2xl flex items-center gap-6 shadow-lg">
              <div className="flex-1">
                <h4 className="font-headline font-bold text-lg mb-1">Architectural Insight</h4>
                <p className="text-sm opacity-80 leading-relaxed">Your data is now being saved to your selected Excel data source. Consistency is the key to architectural mastery.</p>
              </div>
              <Lightbulb size={40} className="opacity-40" />
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <StatItem icon={Check} label="Accuracy" value={`${completionRate}%`} trend="completion" subtext="On-time delivery ritual" />
        <StatItem icon={Clock} label="Tasks" value={tasks.length.toString()} trend="total" subtext="Deep work sessions tracked" />
        <StatItem icon={Share2} label="Data Source" value="Excel" trend="Active" subtext="Local file integration" />
      </section>
    </div>
  );
};

const TaskItem = ({ title, project, description, status, time, category, priority, isCompleted, onToggle }: any) => (
  <div className={`group flex items-start gap-6 p-4 -mx-4 hover:bg-surface-container-low transition-colors rounded-2xl ${isCompleted ? 'opacity-60' : ''}`}>
    <div className="mt-1">
      <div 
        onClick={onToggle}
        className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${isCompleted ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-primary'}`}
      >
        {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h4 className={`font-bold text-lg font-headline ${isCompleted ? 'line-through' : ''}`}>{title}</h4>
          <div className="flex items-center gap-1 text-[10px] font-bold text-on-tertiary-container uppercase tracking-tight">
            <FolderOpen size={12} />
            <span>{project}</span>
          </div>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full self-start mt-1 ${
          status === 'In-Progress' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 
          status === 'Completed' ? 'bg-surface-variant text-on-surface-variant' : 'bg-surface-container-highest text-outline'
        }`}>
          {status}
        </span>
      </div>
      <p className={`text-secondary text-sm max-w-lg ${isCompleted ? 'line-through' : ''}`}>{description}</p>
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
          <Clock size={14} />
          <span>{time || 'No time set'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
          <Layers size={14} />
          <span>{category}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase ${priority === 'High' ? 'text-error' : 'text-outline'}`}>
          <Target size={14} />
          <span>{priority}</span>
        </div>
      </div>
    </div>
  </div>
);

const StatItem = ({ icon: Icon, label, value, trend, subtext }: any) => (
  <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
        <Icon size={18} />
      </div>
      <h4 className="font-headline font-bold">{label}</h4>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-headline font-extrabold">{value}</span>
      <span className="text-xs font-label text-outline">{trend}</span>
    </div>
    <p className="text-xs text-secondary mt-2">{subtext}</p>
  </div>
);
