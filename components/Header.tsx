import React from 'react';
import { Settings2 } from 'lucide-react';
import { SystemState } from '../types';

interface HeaderProps {
  systemState: SystemState;
}

const Header: React.FC<HeaderProps> = ({ systemState }) => {
  const getStatusText = () => {
    switch (systemState) {
      case SystemState.ASSESSING: return "Assessing Answer...";
      case SystemState.GENERATING_FEEDBACK: return "Constructing Feedback...";
      case SystemState.DELIVERING_CONTENT: return "Curating Next Module...";
      case SystemState.WAITING_FOR_USER: return "Waiting for Learner...";
      default: return "System Idle";
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 justify-between backdrop-blur">
      <div className="flex items-center gap-3">
        <Settings2 className="w-5 h-5 text-purple-500" />
        <h1 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Cognitive Multi-Agent Orchestrator
        </h1>
      </div>
      <div className="text-xs text-slate-500 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${systemState === SystemState.IDLE ? 'bg-slate-600' : 'bg-green-500 animate-pulse'}`}></span>
          <span>{getStatusText()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;