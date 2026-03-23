import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  Tag, 
  Flag, 
  Briefcase, 
  Type,
  AlignLeft,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
  initialTask?: any;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onTaskAdded, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work Ritual');
  const [priority, setPriority] = useState('Medium');
  const [project, setProject] = useState('None');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('45m');
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchCategories();
      if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setCategory(initialTask.category || 'Work Ritual');
        setPriority(initialTask.priority || 'Medium');
        setProject(initialTask.project || 'None');
        
        if (initialTask.time) {
          const parts = initialTask.time.split(' ');
          if (parts.length > 1 && parts[0].includes('-')) {
            setDate(parts[0]);
            setTime(parts.slice(1).join(' '));
          } else {
            setDate('');
            setTime(initialTask.time);
          }
        } else {
          setDate('');
          setTime('');
        }
      } else {
        setTitle('');
        setDescription('');
        setCategory('Work Ritual');
        setPriority('Medium');
        setProject('None');
        setDate('');
        setTime('45m');
      }
    }
  }, [isOpen, initialTask]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title) return;
    
    setIsSubmitting(true);
    try {
      const url = initialTask ? `/api/tasks/${initialTask.id}` : '/api/tasks';
      const method = initialTask ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          project,
          time: `${date} ${time}`.trim(),
          status: initialTask ? initialTask.status : 'Upcoming'
        }),
      });

      if (response.ok) {
        onTaskAdded?.();
        onClose();
        toast.success(initialTask ? 'Task updated successfully' : 'Task created successfully');
      } else {
        toast.error(initialTask ? 'Failed to update task' : 'Failed to create task');
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('An error occurred while saving task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
              <div>
                <h2 className="text-2xl font-extrabold text-on-surface font-headline tracking-tight">{initialTask ? 'Edit Task' : 'New Task Entry'}</h2>
                <p className="text-xs text-secondary font-medium mt-0.5">{initialTask ? 'Refine your architectural ritual.' : 'Define a new architectural ritual for your day.'}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Task Definition</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-4 text-outline" size={20} />
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What is the core objective?" 
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-lg font-bold placeholder:text-outline/40 focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Refinement</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 text-outline" size={20} />
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add architectural details or constraints..." 
                      rows={3}
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium placeholder:text-outline/40 focus:ring-2 focus:ring-primary/10 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Classification</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 appearance-none"
                    >
                      {categories.length === 0 ? (
                        <>
                          <option>Work Ritual</option>
                          <option>Personal Growth</option>
                          <option>Administrative</option>
                          <option>Wellness</option>
                        </>
                      ) : (
                        categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Priority Level</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button 
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                          priority === p 
                            ? p === 'High' ? 'bg-error/5 border-error text-error' : 'bg-primary/5 border-primary text-primary'
                            : 'bg-surface-container-low border-transparent text-secondary hover:border-outline-variant/30'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Project Assignment</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <select 
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 appearance-none"
                    >
                      <option value="None">None</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Temporal Schedule</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-tertiary-fixed rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-tertiary-fixed-variant shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Execution Time</p>
                    <p className="text-[10px] text-on-tertiary-fixed uppercase tracking-widest">Estimated Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-20 bg-white/50 border-none rounded-lg py-1 px-2 text-center font-bold text-primary focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-surface-container-low flex items-center justify-between">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-secondary hover:text-primary transition-colors"
                disabled={isSubmitting}
              >
                Cancel Entry
              </button>
                <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !title}
                className="px-10 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Plus size={20} />
                )}
                {initialTask ? 'Update Ritual' : 'Create Ritual'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
