import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  History, 
  ChevronDown, 
  Lightbulb, 
  Rocket, 
  Layout,
  Download,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export const AnalyticsView: React.FC = () => {
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
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedTasks = tasks.filter(t => t.isCompleted);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  // Group by category for impact metrics
  const categories = tasks.reduce((acc: any, task) => {
    const cat = task.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryImpact = Object.entries(categories).map(([label, count]) => ({
    label,
    value: Math.round(((count as number) / tasks.length) * 100),
    color: label === 'Work Ritual' ? 'bg-tertiary' : label === 'Personal Growth' ? 'bg-on-tertiary-fixed-variant' : 'bg-secondary'
  })).sort((a, b) => b.value - a.value);

  // Group by project for project impact
  const projectStats = tasks.reduce((acc: any, task) => {
    const proj = task.project || 'Unassigned';
    acc[proj] = (acc[proj] || 0) + 1;
    return acc;
  }, {});

  const projectImpact = Object.entries(projectStats).map(([label, count]) => ({
    label,
    value: Math.round(((count as number) / tasks.length) * 100),
    color: label === 'Unassigned' ? 'bg-outline' : 'bg-tertiary'
  })).sort((a, b) => b.value - a.value).slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-outline">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-lg font-bold">Powering up the Analytics Engine...</p>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-2 block">Performance Overview</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Analytics <span className="text-on-tertiary-container">Engine</span></h2>
          <p className="mt-3 text-secondary max-w-md font-body leading-relaxed">Your productivity rituals translated into meaningful architectural data.</p>
        </motion.div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2">
            <Download size={14} /> Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">All Time</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard label="Productivity Score" value={completionRate.toString()} trend="+4.2%" progress={completionRate} color="bg-tertiary" />
        <MetricCard label="Tasks Completed" value={completedTasks.length.toString()} trend={`+${completedTasks.length}`} progress={70} color="bg-secondary-fixed-dim" />
        <MetricCard label="Total Projects" value={projects.length.toString()} trend="Stable" progress={45} color="bg-tertiary-fixed-dim" />
        <MetricCard label="Total Rituals" value={tasks.length.toString()} trend="Active" progress={30} color="bg-primary-fixed-dim" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold">Completion Trends</h3>
              <p className="text-xs text-secondary">Task output vs Target velocity</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <select className="bg-surface-container-low border-none rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold focus:ring-0 appearance-none cursor-pointer">
                  <option>All Projects</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-outline" size={14} />
              </div>
            </div>
          </div>
          
          <div className="relative h-64 flex items-end gap-4 px-2">
            {[40, 65, 85, 55, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer h-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className={`w-full bg-tertiary rounded-t-lg chart-bar ${i === 2 ? 'opacity-100' : 'opacity-60'} group-hover:opacity-100 transition-opacity`}
                />
                <span className={`text-[10px] text-center mt-2 ${i === 2 ? 'font-bold text-primary' : 'text-outline'}`}>W{i+1}</span>
              </div>
            ))}
            <div className="absolute bottom-[60%] left-0 w-full border-t border-dashed border-outline-variant/40 pointer-events-none"></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Impact Metrics</h3>
          </div>
          <div className="space-y-5 flex-1">
            {categoryImpact.length > 0 ? (
              categoryImpact.map((item, idx) => (
                <ImpactItem key={idx} label={item.label} value={item.value} color={item.color} />
              ))
            ) : (
              <p className="text-sm text-outline italic">No data available</p>
            )}
          </div>
          <div className="mt-8 p-4 bg-tertiary-fixed rounded-xl flex items-start gap-3">
            <Lightbulb size={18} className="text-on-tertiary-fixed mt-0.5" />
            <p className="text-[11px] leading-relaxed text-on-tertiary-fixed font-medium">
              {completionRate > 80 ? 'Exceptional consistency! Your architectural rituals are highly optimized.' : 'Focus on completing pending tasks to improve your overall productivity score.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Project Impact</h3>
          <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e0e3e5" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#001624" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="138" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#b9c7e0" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="210" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">TOP 3</span>
              <span className="text-xl font-bold">Impact</span>
            </div>
          </div>
          <div className="space-y-3">
            {projectImpact.map((item, idx) => (
              <ImpactLegend key={idx} color={item.color} label={item.label} value={`${item.value}%`} />
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Focus Intensity</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-sm ${
                  [2, 3, 4, 8, 9, 10, 11, 12, 17, 18, 24, 25].includes(i) 
                    ? (i % 3 === 0 ? 'bg-tertiary' : i % 2 === 0 ? 'bg-tertiary-fixed' : 'bg-tertiary-fixed-dim') 
                    : 'bg-surface-container-low'
                }`}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-[10px] font-bold text-outline">LESS FOCUS</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-surface-container-low rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-tertiary-fixed rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-tertiary rounded-sm"></div>
            </div>
            <span className="text-[10px] font-bold text-outline">PEAK FOCUS</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Strategic Milestones</h3>
          <div className="space-y-6">
            {projects.slice(0, 2).map((project) => (
              <MilestoneItem 
                key={project.id}
                icon={Rocket} 
                label={project.name} 
                progress={project.status === 'Completed' ? 100 : project.status === 'Active' ? 65 : 20} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, progress, color, isNegative }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
    <p className="text-xs font-medium text-secondary mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">{value}</span>
      <span className={`text-xs font-bold ${isNegative ? 'text-error' : 'text-on-tertiary-container'}`}>{trend}</span>
    </div>
    <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const ImpactItem = ({ label, value, color }: any) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-xs font-bold">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-surface-container-low rounded-full">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

const ImpactLegend = ({ color, label, value }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-xs font-bold">{value}</span>
  </div>
);

const MilestoneItem = ({ icon: Icon, label, progress }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold">{label}</p>
      <p className="text-[10px] text-secondary">{progress}% complete</p>
    </div>
    <div className="w-10 h-10 flex items-center justify-center relative">
      <svg className="w-full h-full -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#e0e3e5" strokeWidth="4" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="#0c1427" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - progress} />
      </svg>
    </div>
  </div>
);
