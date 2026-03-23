import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  TrendingUp, 
  Rocket, 
  Users, 
  Zap, 
  Clock,
  ArrowUpRight,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export const ActivityView: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-2 block">Real-time Rituals</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Activity <span className="text-on-tertiary-container">Feed</span></h2>
          <p className="mt-3 text-secondary max-w-md font-body leading-relaxed">Stay synchronized with your progress and team architectural updates.</p>
        </motion.div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchActivities}
            className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />} Refresh
          </button>
          <button className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Bell size={14} /> Notifications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-secondary font-medium">Synchronizing rituals...</p>
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center px-6">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-outline">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Silence in the Studio</h3>
              <p className="text-secondary max-w-xs">No recent activities detected. Start defining your rituals to see them here.</p>
            </div>
          )}
          
          {!isLoading && activities.length > 0 && (
            <button className="w-full py-4 text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2">
              End of recent history <Clock size={16} />
            </button>
          )}
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h3 className="text-sm font-bold mb-6 flex items-center justify-between">
              Activity Volume
              <span className="text-[10px] text-on-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded">+12%</span>
            </h3>
            <div className="flex items-end justify-between h-24 gap-1 px-2">
              {[30, 45, 60, 40, 70, 50, 80, 65, 45, 55, 75, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-surface-container-high rounded-t-sm relative group">
                  <div className={`absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all duration-500 ${i === 6 ? 'h-[80%]' : `h-[${h}%]`}`} style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-bold text-outline uppercase tracking-widest">
              <span>08:00 AM</span>
              <span>08:00 PM</span>
            </div>
          </div>

          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/20">
            <h3 className="text-sm font-bold mb-4">Focus Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant flex-shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold">Peak Momentum</p>
                  <p className="text-[10px] text-on-primary-container/70">You are most active in the morning hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold">Deep Work Ratio</p>
                  <p className="text-[10px] text-on-primary-container/70">Your focus sessions are increasing in quality.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity }: any) => {
  const icons: Record<string, React.ReactNode> = {
    Completion: <CheckCircle2 size={18} className="text-on-tertiary-container" />,
    Insight: <Zap size={18} className="text-on-tertiary-fixed-variant" />,
    Milestone: <Rocket size={18} className="text-primary" />,
    Update: <Users size={18} className="text-secondary" />
  };

  const bgColors: Record<string, string> = {
    Completion: 'bg-tertiary-fixed',
    Insight: 'bg-tertiary-fixed-dim',
    Milestone: 'bg-primary-fixed-dim',
    Update: 'bg-surface-container-high'
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex items-start gap-6 group hover:bg-surface-container-low transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColors[activity.type] || bgColors.Update}`}>
        {icons[activity.type] || icons.Update}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-on-surface">{activity.title}</h4>
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{activity.timeAgo}</span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {activity.user && <span className="font-bold text-primary">{activity.user} </span>}
          {activity.content}
        </p>
        {activity.project && (
          <div className="mt-2">
            <span className="text-[10px] font-bold text-on-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded uppercase tracking-widest">
              {activity.project}
            </span>
          </div>
        )}
      </div>
      <button className="p-2 text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
        <MoreVertical size={18} />
      </button>
    </div>
  );
};
