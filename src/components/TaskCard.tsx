import React, { useState, useRef, useEffect } from 'react';
import { Check, Edit2, MoreVertical, Clock, Layers, FolderOpen, Trash2, Copy } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  isEditing?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, isEditing, onDelete, onEdit, onDuplicate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const isCompleted = task.isCompleted || task.status === 'Completed';

  const priorityColors: Record<string, string> = {
    High: 'bg-error/10 text-error',
    Medium: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    Low: 'bg-outline-variant/30 text-on-surface-variant'
  };

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 group transition-all duration-300 hover:translate-x-1 hover:shadow-md ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex-shrink-0">
        <button 
          onClick={() => onToggle?.(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted 
              ? 'bg-primary border-primary text-white' 
              : 'border-outline-variant group-hover:border-primary'
          }`}
        >
          {isCompleted && <Check size={14} strokeWidth={3} />}
        </button>
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-label ${priorityColors[task.priority] || priorityColors.Medium}`}>
            {task.priority} Priority
          </span>
          <span className="text-xs font-medium text-on-secondary-container">{task.category}</span>
        </div>
        
        <div className="flex items-baseline gap-3">
          <h3 className={`font-headline text-lg font-bold text-on-surface ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.project && task.project !== 'None' && (
            <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight">
              {task.project}
            </span>
          )}
        </div>
        
        {task.description && (
          <p className="text-on-surface-variant text-sm mt-1 max-w-2xl">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          {task.time && (
            <div className="flex items-center gap-1.5 text-[11px] text-outline font-medium">
              <Clock size={14} />
              <span>{task.time}</span>
            </div>
          )}
          {task.project && task.project !== 'None' && (
            <div className="flex items-center gap-1.5 text-[11px] text-outline font-medium">
              <FolderOpen size={14} />
              <span>{task.project}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`flex flex-col items-end gap-2 transition-opacity ${isEditing || showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {isEditing ? (
          <button 
            onClick={() => onDelete?.(task.id)}
            className="p-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit?.(task)}
              className="p-1.5 hover:bg-surface-container-low rounded-lg transition-colors text-secondary hover:text-primary"
            >
              <Edit2 size={16} />
            </button>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded-lg transition-colors ${showMenu ? 'bg-surface-container-low text-primary' : 'hover:bg-surface-container-low text-secondary hover:text-primary'}`}
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/10 overflow-hidden z-20 py-1">
                  <button 
                    onClick={() => {
                      onEdit?.(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit Task
                  </button>
                  <button 
                    onClick={() => {
                      onDuplicate?.(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <div className="h-px bg-outline-variant/20 my-1"></div>
                  <button 
                    onClick={() => {
                      onDelete?.(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
