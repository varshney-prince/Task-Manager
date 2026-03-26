import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  History, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  LogOut,
  HelpCircle,
  User,
  Zap,
  Activity as ActivityIcon,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddTask: () => void;
  onAddProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onAddTask, onAddProject }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-surface-container-low border-r border-outline-variant/10 flex flex-col py-8 px-4 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-extrabold text-primary font-headline tracking-tight">Task Architect</h1>
        <p className="text-[10px] font-bold text-on-secondary-container uppercase tracking-widest mt-1">Focused Rituals</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm border-r-2 border-primary' 
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-primary' : 'text-secondary group-hover:text-primary'} />
            <span className="font-manrope text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button 
          onClick={onAddProject}
          className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-primary py-3 rounded-xl font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95"
        >
          <Briefcase size={18} />
          <span className="font-manrope text-sm">Add Project</span>
        </button>

        <button 
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="font-manrope text-sm">Add Task</span>
        </button>

        <div className="pt-4 border-t border-outline-variant/10">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary transition-colors">
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-2 pt-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3YTgs4AcgGlK1_rVf7mpAGaqIfalfbxfHxSmuyI_0z8o8Vid91INABheleS-8uoaZPArCxzVaeFIefrjanntRAhfaWuBsnxOJwdxPkEngLcwlDwcRQWFNXqB8-LK8tjz9PhJg33bNQWGfpdrihTYWzRdupQid91iTFJbK9kjaUyQpFW8nAGpYkuPSkbPz2ikDQW9iSInzbY1EreaG6HNorl4m92Za8VakALph0DwgcC6ghCSREwbKcE5J2sA9UgvfKIhVQSGkXQcS" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-primary">Julian Pierce</p>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-tighter">Architect Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const TopBar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, title: 'Task Completed', message: 'You finished "Review Q3 Report"', time: '10m ago', unread: true },
    { id: 2, title: 'New Assignment', message: 'You were assigned "Update Design System"', time: '1h ago', unread: true },
    { id: 3, title: 'Reminder', message: 'Team sync in 15 minutes', time: '2h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 py-4">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks or rituals..." 
            className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 placeholder:text-outline/60 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-colors relative rounded-full ${showNotifications ? 'bg-surface-container-low text-primary' : 'text-secondary hover:text-primary hover:bg-surface-container-lowest'}`}
          >
            <Bell size={20} className="text-[#334155]" strokeWidth={2} />
            <span className="absolute top-[6px] right-[8px] w-2 h-2 bg-[#0ea5e9] rounded-full border-2 border-background"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
                    <h3 className="font-bold text-sm text-on-surface">Notifications</h3>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-bold ${notif.unread ? 'text-on-surface' : 'text-secondary'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-outline whitespace-nowrap mt-0.5">{notif.time}</span>
                        </div>
                        <p className="text-xs text-secondary mt-1">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-outline-variant/10 bg-surface-container-low">
                    <button className="text-xs font-bold text-secondary hover:text-primary transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-[#FDBA74] flex items-center justify-center overflow-hidden shadow-sm">
          <div className="w-5 h-6 border-2 border-white rounded-sm bg-white/20"></div>
        </div>
      </div>
    </header>
  );
};
