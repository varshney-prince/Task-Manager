import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, CheckCircle, ArrowLeft, Target, Clock } from 'lucide-react';

let audioCtx: AudioContext | null = null;

const playTick = () => {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const t = audioCtx.currentTime;
    
    // 1. High-frequency "click" (filtered noise)
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500; // Muted high frequencies
    filter.Q.value = 1.5;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.15, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noiseSource.start(t);
    
    // 2. Low-frequency "thump" (mechanical body)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
    
    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.05);
    
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

const FlipUnit = ({ value, label }: { value: string, label: string }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 600); // Total animation time (0.3s + 0.3s)
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-40 md:w-48 md:h-56 bg-[#121212] rounded-2xl md:rounded-3xl shadow-2xl border border-white/5" style={{ perspective: '1000px' }}>
        
        {/* Static Top Half - Shows NEXT value */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl" style={{ clipPath: 'inset(0 0 50% 0)' }}>
          <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
            <span className="text-[5rem] md:text-[8rem] font-bold text-[#e5e5e5] tracking-tighter tabular-nums leading-none">
              {value}
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
          </div>
        </div>

        {/* Static Bottom Half - Shows CURRENT value */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl" style={{ clipPath: 'inset(50% 0 0 0)' }}>
          <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
            <span className="text-[5rem] md:text-[8rem] font-bold text-[#e5e5e5] tracking-tighter tabular-nums leading-none">
              {prevValue}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
        </div>

        {/* Flipper - Top Half flipping down */}
        {isFlipping && (
          <motion.div
            key={`top-${value}`}
            initial={{ rotateX: 0, filter: 'brightness(1)' }}
            animate={{ rotateX: -90, filter: 'brightness(0.3)' }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl z-10"
            style={{ clipPath: 'inset(0 0 50% 0)', transformOrigin: 'center', backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
              <span className="text-[5rem] md:text-[8rem] font-bold text-[#e5e5e5] tracking-tighter tabular-nums leading-none">
                {prevValue}
              </span>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
            </div>
          </motion.div>
        )}

        {/* Flipper - Bottom Half flipping down */}
        {isFlipping && (
          <motion.div
            key={`bottom-${value}`}
            initial={{ rotateX: 90, filter: 'brightness(0.3)' }}
            animate={{ rotateX: 0, filter: 'brightness(1)' }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl z-10"
            style={{ clipPath: 'inset(50% 0 0 0)', transformOrigin: 'center', backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
              <span className="text-[5rem] md:text-[8rem] font-bold text-[#e5e5e5] tracking-tighter tabular-nums leading-none">
                {value}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          </motion.div>
        )}

        {/* Center split line (The hinge) */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] md:h-[4px] bg-black z-20 w-full flex items-center justify-between shadow-[0_1px_0_rgba(255,255,255,0.15)]">
           <div className="w-1.5 h-4 md:w-2 md:h-6 bg-black rounded-r-md"></div>
           <div className="w-1.5 h-4 md:w-2 md:h-6 bg-black rounded-l-md"></div>
        </div>

      </div>
      <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
};

interface QuickFocusViewProps {
  onBack: () => void;
}

export const QuickFocusView: React.FC<QuickFocusViewProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Deep Work');

  const categories = ['Deep Work', 'Learning', 'Admin', 'Meeting', 'Break', 'Other'];

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (Array.isArray(data)) {
        // Only show pending tasks
        setTasks(data.filter(t => !t.isCompleted && t.status !== 'Completed'));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time > 0) {
            playTick();
            return time - 1;
          }
          return 0;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      saveSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setInitialTime(25 * 60);
  };

  const saveSession = async () => {
    const task = tasks[currentTaskIndex];
    const duration = initialTime - timeLeft;
    if (duration <= 0) return;

    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task?.id || '',
          taskTitle: task?.title || 'Focus Session',
          category: selectedCategory,
          duration: duration,
          date: new Date().toISOString().split('T')[0]
        })
      });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeCurrentTask = async () => {
    const task = tasks[currentTaskIndex];
    if (!task) return;

    await saveSession();

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: true, status: 'Completed' })
      });

      if (response.ok) {
        // Remove from local list and move to next
        const newTasks = [...tasks];
        newTasks.splice(currentTaskIndex, 1);
        setTasks(newTasks);
        resetTimer();
        
        // If we're out of bounds, go back to 0
        if (currentTaskIndex >= newTasks.length) {
          setCurrentTaskIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const skipTask = async () => {
    await saveSession();
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      resetTimer();
    } else {
      setCurrentTaskIndex(0);
      resetTimer();
    }
  };

  const currentTask = tasks[currentTaskIndex];

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {isLoading ? (
        <div className="text-outline animate-pulse flex flex-col items-center gap-4">
          <Target size={48} />
          <p>Preparing your focus session...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto text-primary mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4">All Caught Up!</h2>
          <p className="text-secondary mb-8">You have no pending tasks. Take a break or add new tasks from the dashboard.</p>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-surface-container-lowest p-12 rounded-[3rem] shadow-2xl border border-outline-variant/10 text-center relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-fixed/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low text-sm font-bold text-secondary mb-8">
              <Target size={16} />
              Task {currentTaskIndex + 1} of {tasks.length}
            </div>

            <div className="mb-6 flex justify-center">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface-container-high border border-outline-variant/20 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-4 leading-tight">
              {currentTask?.title}
            </h2>
            
            {currentTask?.description && (
              <p className="text-lg text-secondary mb-12 max-w-xl mx-auto">
                {currentTask.description}
              </p>
            )}

            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
                <FlipUnit value={mins} label="Minutes" />
                <div className="flex flex-col gap-4 pb-8">
                  <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                </div>
                <FlipUnit value={secs} label="Seconds" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={toggleTimer}
                  className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-outline-variant/20 pt-8">
              <button 
                onClick={skipTask}
                className="px-6 py-3 rounded-xl font-bold text-secondary hover:bg-surface-container-low transition-colors"
              >
                Skip for now
              </button>
              <button 
                onClick={completeCurrentTask}
                className="px-8 py-3 rounded-xl font-bold bg-on-surface text-surface-container-lowest hover:bg-on-surface/90 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Mark Completed
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
