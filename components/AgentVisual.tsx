import React from 'react';
import { AgentRole } from '../types';
import { BrainCircuit, BookOpen, MessageSquare, Activity, User } from 'lucide-react';

interface AgentVisualProps {
  role: AgentRole;
  isActive: boolean;
  isCenter?: boolean;
  statusMessage?: string;
}

const AgentVisual: React.FC<AgentVisualProps> = ({ role, isActive, isCenter, statusMessage }) => {
  
  const getIcon = () => {
    switch (role) {
      case AgentRole.MO: return <BrainCircuit className="w-8 h-8" />;
      case AgentRole.CDA: return <BookOpen className="w-6 h-6" />;
      case AgentRole.LAA: return <Activity className="w-6 h-6" />;
      case AgentRole.FGA: return <MessageSquare className="w-6 h-6" />;
      case AgentRole.USER: return <User className="w-6 h-6" />;
    }
  };

  const getColor = () => {
    switch (role) {
      case AgentRole.MO: return 'text-purple-400 border-purple-500 bg-purple-900/20';
      case AgentRole.CDA: return 'text-blue-400 border-blue-500 bg-blue-900/20';
      case AgentRole.LAA: return 'text-amber-400 border-amber-500 bg-amber-900/20';
      case AgentRole.FGA: return 'text-emerald-400 border-emerald-500 bg-emerald-900/20';
      case AgentRole.USER: return 'text-slate-200 border-slate-500 bg-slate-800';
    }
  };

  const activeClass = isActive ? 'scale-105 shadow-[0_0_25px_rgba(255,255,255,0.2)]' : 'opacity-60 grayscale-[0.5] scale-100';
  const centerClass = isCenter ? 'w-32 h-32 text-2xl z-20' : 'w-24 h-24 text-sm z-10';

  // Helper to extract the text color class for background use
  const getGlowColor = () => {
     // Returns just the color code for bg-current usage
     const classes = getColor();
     return classes.split(' ').find(c => c.startsWith('text-')) || 'text-white';
  };

  return (
    <div className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-in-out`}>
      
      {/* Active Animation Layer */}
      {isActive && (
        <div className={`absolute inset-0 flex items-center justify-center z-0 pointer-events-none`}>
          {/* Radar Ping Effect */}
          <div className={`absolute rounded-full opacity-20 animate-ping ${centerClass} ${getGlowColor()} bg-current`}></div>
          {/* Steady Glow */}
          <div className={`absolute rounded-full opacity-10 blur-xl animate-pulse ${centerClass} ${getGlowColor()} bg-current scale-125`}></div>
        </div>
      )}

      {/* Main Agent Node */}
      <div 
        className={`
          relative flex items-center justify-center rounded-full border-2 backdrop-blur-md z-10
          ${getColor()} ${activeClass} ${centerClass}
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        `}
      >
        {getIcon()}
      </div>

      <div className={`mt-3 font-bold text-center transition-all duration-500 ${isActive ? 'text-slate-100 translate-y-0 opacity-100' : 'text-slate-600 translate-y-1 opacity-80'}`}>
        {role}
      </div>
      
      {/* Status Message Bubble */}
      <div 
        className={`
          absolute -top-16 left-1/2 -translate-x-1/2 w-52 
          bg-slate-900/95 border border-slate-600 text-slate-200 text-xs p-3 rounded-lg shadow-2xl text-center z-50
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom
          ${isActive && statusMessage ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
        `}
      >
         <div className="font-semibold mb-1 text-purple-300 uppercase text-[10px] tracking-wider">Current Task</div>
         {statusMessage}
         {/* Arrow pointing down */}
         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-600 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default AgentVisual;