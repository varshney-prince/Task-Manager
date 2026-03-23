import React from 'react';
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
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryView: React.FC = () => {
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
            <span className="text-sm font-bold">October 2024</span>
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
              {['All Projects', 'Q4 Strategy', 'Riverside Project', 'Internal API', 'Brand Identity'].map((project, i) => (
                <label key={project} className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                  <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">{project}</span>
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
              <p className="text-xs text-primary-fixed-dim leading-relaxed">Your focus efficiency in October was 12% higher than the previous month.</p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                View Full Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {[20, 21, 22, 23, 24, 25, 26].map((day, i) => (
              <button 
                key={day} 
                className={`flex-shrink-0 w-14 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  i === 3 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Oct</span>
                <span className="text-lg font-bold">{day}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <HistoryCard 
              title="Finalize architectural blueprints for Riverside"
              project="Riverside Project"
              time="Completed at 2:45 PM"
              duration="2h 15m focus"
              category="Work"
            />
            <HistoryCard 
              title="Weekly sync with engineering team"
              project="Internal API"
              time="Completed at 11:30 AM"
              duration="45m focus"
              category="Work"
            />
            <HistoryCard 
              title="Review Q4 strategy document"
              project="Q4 Strategy"
              time="Completed at 9:15 AM"
              duration="1h 30m focus"
              category="Strategy"
            />
            <HistoryCard 
              title="Design System: Component Audit"
              project="Brand Identity"
              time="Completed at 5:00 PM (Yesterday)"
              duration="3h 10m focus"
              category="Design"
            />
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
