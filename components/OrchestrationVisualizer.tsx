import React from 'react';
import { SystemState, AgentRole } from '../types';
import AgentVisual from './AgentVisual';

interface OrchestrationVisualizerProps {
  systemState: SystemState;
}

const OrchestrationVisualizer: React.FC<OrchestrationVisualizerProps> = ({ systemState }) => {
  
  // Helper to determine line styling based on active state
  const getLineProps = (targetState: SystemState) => {
    const isActive = systemState === targetState;
    return {
      stroke: isActive ? '#c084fc' : '#334155', // Purple-400 vs Slate-700
      strokeWidth: isActive ? 3 : 2,
      strokeDasharray: isActive ? '8,4' : '4,4',
      className: isActive ? 'animate-flow opacity-100 transition-colors duration-300' : 'opacity-30 transition-colors duration-500'
    };
  };

  return (
    <div className="col-span-6 row-span-7 bg-slate-900/30 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center group">
        <style>{`
          @keyframes flow {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          .animate-flow {
            animation: flow 1s linear infinite;
          }
        `}</style>

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80"></div>
        
        {/* Connection Lines (Data Flow) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* MO to CDA (Top Left) */}
          <line x1="50%" y1="50%" x2="20%" y2="20%" {...getLineProps(SystemState.DELIVERING_CONTENT)} />
          
          {/* MO to LAA (Top Right) */}
          <line x1="50%" y1="50%" x2="80%" y2="20%" {...getLineProps(SystemState.ASSESSING)} />
          
          {/* MO to FGA (Bottom) */}
          <line x1="50%" y1="50%" x2="50%" y2="80%" {...getLineProps(SystemState.GENERATING_FEEDBACK)} />
        </svg>

        {/* Agents */}
        <div className="absolute top-10 left-10">
          <AgentVisual 
            role={AgentRole.CDA} 
            isActive={systemState === SystemState.DELIVERING_CONTENT} 
            statusMessage="Selecting Content based on Mastery" 
          />
        </div>
        <div className="absolute top-10 right-10">
          <AgentVisual 
            role={AgentRole.LAA} 
            isActive={systemState === SystemState.ASSESSING} 
            statusMessage="Analyzing Answer & Updating Model" 
          />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
           <AgentVisual 
             role={AgentRole.FGA} 
             isActive={systemState === SystemState.GENERATING_FEEDBACK} 
             statusMessage="Generating Motivation & Feedback" 
            />
        </div>
        
        {/* Center MO */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AgentVisual 
            role={AgentRole.MO} 
            isActive={true} 
            isCenter={true} 
            statusMessage={
              systemState === SystemState.IDLE ? "System Idle" :
              systemState === SystemState.WAITING_FOR_USER ? "Waiting for Input" :
              "Orchestrating..."
            }
          />
        </div>
    </div>
  );
};

export default OrchestrationVisualizer;