import React, { useState, useEffect } from 'react';
import { Plus, PlusCircle, Settings, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskCard } from '../components/TaskCard';

export const DashboardView: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksRes, projectsRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/projects')
        ]);
        const tasksData = await tasksRes.json();
        const projectsData = await projectsRes.json();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Group tasks by category
  const categories = tasks.reduce((acc: any, task) => {
    const cat = task.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryList = Object.entries(categories).map(([label, count]) => ({
    label,
    count: count as number,
    color: label === 'Work Ritual' ? 'bg-primary' : label === 'Personal Growth' ? 'bg-tertiary-fixed-dim' : 'bg-on-secondary-container'
  }));

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
          <button className="bg-surface-container-low px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-colors">Edit List</button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
            <Zap size={16} fill="currentColor" />
            Quick Focus
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 mb-2 pb-2 overflow-x-auto no-scrollbar">
            <button className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white transition-all">
              All Projects
            </button>
            {projects.slice(0, 4).map((project) => (
              <button 
                key={project.id}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all"
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
            ) : tasks.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline/40">
                  <Target size={32} />
                </div>
                <p className="text-outline font-medium">Your ritual list is empty.</p>
              </div>
            ) : (
              tasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))
            )}
            
            {!isLoading && (
              <button className="w-full border-2 border-dashed border-outline-variant/30 p-6 rounded-2xl flex items-center justify-center gap-3 text-secondary hover:bg-surface-container-low transition-all group">
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
              <Settings size={14} className="text-secondary" />
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
            <h4 className="font-headline text-sm font-bold mb-4">Focus Sessions</h4>
            <div className="flex items-center justify-between mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isToday = i === 0;
                return (
                  <div key={day} className={`text-center ${isToday ? '' : 'opacity-40'}`}>
                    <span className="text-[10px] font-bold text-secondary uppercase block">{day}</span>
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold mt-1 ${isToday ? 'bg-primary text-white' : ''}`}>
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border-l-2 border-on-tertiary-container">
              <p className="text-xs font-bold text-on-tertiary-container uppercase tracking-tighter mb-1">Architectural Mastery</p>
              <p className="text-sm font-bold leading-tight">Your data is synchronized with Excel</p>
              <p className="text-[11px] text-secondary mt-1 flex items-center gap-1">
                <Clock size={12} /> Local Data Source Active
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
