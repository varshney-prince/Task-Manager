import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated: () => void;
}

const COLORS = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary',
  'bg-error',
  'bg-primary-fixed',
  'bg-secondary-fixed',
  'bg-tertiary-fixed',
  'bg-tertiary-fixed-dim',
  'bg-on-secondary-container',
  'bg-on-tertiary-container',
];

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ isOpen, onClose, onCategoriesUpdated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, color: newColor }),
      });
      
      if (response.ok) {
        setNewName('');
        setNewColor(COLORS[0]);
        setIsAdding(false);
        fetchCategories();
        onCategoriesUpdated();
        toast.success('Category added successfully');
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error('An error occurred while adding category');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, color: editColor }),
      });
      
      if (response.ok) {
        setEditingId(null);
        fetchCategories();
        onCategoriesUpdated();
        toast.success('Category updated successfully');
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('An error occurred while updating category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchCategories();
        onCategoriesUpdated();
        toast.success('Category deleted successfully');
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('An error occurred while deleting category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
            <h2 className="text-xl font-bold font-headline text-on-surface">Manage Categories</h2>
            <button 
              onClick={onClose}
              className="p-2 text-secondary hover:text-primary hover:bg-surface-container-low rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="text-center py-8 text-secondary">Loading categories...</div>
            ) : (
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                    {editingId === category.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          autoFocus
                        />
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map(c => (
                            <button
                              key={c}
                              onClick={() => setEditColor(c)}
                              className={`w-6 h-6 rounded-full ${c} ${editColor === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-secondary hover:bg-surface-container-high rounded-lg"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleUpdate(category.id)}
                            className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg flex items-center gap-1"
                          >
                            <Check size={14} /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => startEdit(category)}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="p-1.5 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isAdding ? (
                  <div className="bg-surface-container-low p-4 rounded-xl border border-primary/30 space-y-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Category name..."
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setNewColor(c)}
                          className={`w-6 h-6 rounded-full ${c} ${newColor === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        onClick={() => setIsAdding(false)}
                        className="px-3 py-1.5 text-xs font-bold text-secondary hover:bg-surface-container-high rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAdd}
                        disabled={!newName.trim()}
                        className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg disabled:opacity-50"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-outline-variant/30 rounded-xl text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                  >
                    <Plus size={16} /> Add New Category
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
