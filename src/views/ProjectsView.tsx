import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  Loader2,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-12 flex items-end justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-2 block">Portfolio Overview</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Project <span className="text-on-tertiary-container">Portfolio</span></h2>
          <p className="mt-3 text-secondary max-w-md font-body leading-relaxed">Review and manage your architectural ventures persisted in the Excel database.</p>
        </motion.div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 placeholder:text-outline/60 transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-surface-container-low border border-outline-variant/10 rounded-xl text-outline hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-outline">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-sm font-bold">Synchronizing with Excel DB...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-surface-container-lowest p-20 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-outline mb-6">
              <Briefcase size={40} />
            </div>
            <h4 className="text-xl font-bold text-on-surface">No projects persisted yet</h4>
            <p className="text-sm text-secondary max-w-xs mt-2">Use the "Add Project" button in the sidebar to create your first architectural venture.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col group hover:bg-surface-container-low transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Briefcase size={28} />
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    project.status === 'Active' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                    project.status === 'Completed' ? 'bg-surface-variant text-on-surface-variant' : 'bg-surface-container-high text-outline'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h4 className="font-bold text-xl text-on-surface mb-2">{project.name}</h4>
                <p className="text-sm text-secondary line-clamp-3 mb-8 flex-1">{project.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2 text-[10px] text-outline font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <button className="p-2 text-outline hover:text-primary transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
