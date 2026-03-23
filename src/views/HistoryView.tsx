import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  MoreHorizontal,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryView: React.FC = () => {
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
        
        // Only show completed tasks in history
        const completedTasks = (Array.isArray(tasksData) ? tasksData : []).filter(t => t.isCompleted);
        setTasks(completedTasks);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (error) {
        console.error('Failed to fetch history data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-2 block">Archive & Reflection</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Ritual <span className="text-on-tertiary-container">History</span></h2>
          <p className="mt-3 text-secondary max-w-md font-body leading-relaxed">Review your past architectural cycles and performance milestones.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/10 shadow-sm">
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-outline">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-4">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-outline">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Filter size={16} className="text-outline" />
              Project Filters
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">All Projects</span>
              </label>
              {projects.slice(0, 5).map((project) => (
                <label key={project.id} className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">{project.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/20">
            <h3 className="text-sm font-bold mb-4">Performance Insights</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-primary-fixed-dim uppercase tracking-widest">Focus Efficiency</span>
                  <span className="text-xl font-bold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
                  <div className="h-full bg-on-tertiary-container w-[92%]"></div>
                </div>
              </div>
              <p className="text-xs text-primary-fixed-dim leading-relaxed">Your focus efficiency this month is showing strong architectural consistency.</p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                View Full Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const isToday = i === 6;
              return (
                <button 
                  key={i} 
                  className={`flex-shrink-0 w-14 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                    isToday ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-outline">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-bold">Retrieving archive...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-surface-container-lowest p-20 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-outline mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-on-surface">No completed rituals found</h4>
                <p className="text-sm text-secondary max-w-xs mt-2">Complete your daily tasks to build your architectural history.</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HistoryCard 
                    title={task.title}
                    project={task.project || 'Unassigned'}
                    time={`Completed on ${new Date(task.createdAt).toLocaleDateString()}`}
                    duration={task.time || 'No duration'}
                    category={task.category || 'General'}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryCard = ({ title, project, time, duration, category }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center gap-6 group hover:bg-surface-container-low transition-all">
    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-tertiary-container group-hover:bg-primary group-hover:text-white transition-all">
      <CheckCircle2 size={24} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-widest">{category}</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
        <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-tight">{project}</span>
      </div>
      <h4 className="font-headline font-bold text-lg text-on-surface">{title}</h4>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
          <Clock size={14} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
          <TrendingUp size={14} />
          <span>{duration}</span>
        </div>
      </div>
    </div>
    <button className="p-2 text-outline hover:text-primary transition-colors">
      <MoreHorizontal size={20} />
    </button>
  </div>
);
