import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Briefcase, 
  AlignLeft, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded?: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onProjectAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', description: '', status: 'Active' });
        setMessage({ type: 'success', text: 'Project persisted to Excel DB!' });
        if (onProjectAdded) onProjectAdded();
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 1500);
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save project. Please try again.' });
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
            className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
              <div>
                <h2 className="text-2xl font-extrabold text-on-surface font-headline tracking-tight">New Project Architect</h2>
                <p className="text-xs text-secondary font-medium mt-0.5">Define a new architectural venture for your portfolio.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Project Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Riverside Commercial Hub" 
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 text-outline" size={18} />
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Architectural scope and objectives..." 
                      rows={4}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Initial Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 appearance-none"
                    >
                      <option>Active</option>
                      <option>On Hold</option>
                      <option>Planning</option>
                      <option>Completed</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
                  </div>
                </div>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      message.type === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-bold">{message.text}</span>
                  </motion.div>
                )}
              </div>

              <div className="px-8 py-6 bg-surface-container-low flex items-center justify-between">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-bold text-secondary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Persisting...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
