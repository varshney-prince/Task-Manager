import React from 'react';
import { Check, Edit2, MoreVertical, Clock, Layers, FolderOpen } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
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

      <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-surface-container-low rounded-lg transition-colors text-secondary hover:text-primary">
          <Edit2 size={16} />
        </button>
        <button className="p-1.5 hover:bg-surface-container-low rounded-lg transition-colors text-secondary hover:text-primary">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
