import React, { useState } from 'react';
import { Sidebar, TopBar } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { AnalyticsView } from './views/AnalyticsView';
import { HistoryView } from './views/HistoryView';
import { ActivityView } from './views/ActivityView';
import { SettingsView } from './views/SettingsView';
import { ProjectsView } from './views/ProjectsView';
import { AddTaskModal } from './components/AddTaskModal';
import { AddProjectModal } from './components/AddProjectModal';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'history':
        return <HistoryView />;
      case 'activity':
        return <ActivityView />;
      case 'settings':
        return <SettingsView />;
      case 'projects':
        return <ProjectsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddTask={() => setIsTaskModalOpen(true)}
        onAddProject={() => setIsProjectModalOpen(true)}
      />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Add Button for Mobile/Quick Access */}
      <button 
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 lg:hidden"
      >
        <PlusIcon size={24} />
      </button>

      <AddTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onTaskAdded={() => {
          // If we are on the tasks tab, we might want to refresh the list
          if (activeTab === 'tasks') {
            setActiveTab('dashboard');
            setTimeout(() => setActiveTab('tasks'), 10);
          }
        }}
      />

      <AddProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        onProjectAdded={() => {
          // If we are on the projects tab, we might want to refresh the list
          if (activeTab === 'projects') {
            setActiveTab('dashboard');
            setTimeout(() => setActiveTab('projects'), 10);
          }
        }}
      />
    </div>
  );
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default App;
