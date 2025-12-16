import React from 'react';
import { Play } from 'lucide-react';
import { SystemState } from '../types';

interface ControlPanelProps {
  hasStarted: boolean;
  apiKey: string;
  onStart: () => void;
  systemState: SystemState;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ hasStarted, apiKey, onStart, systemState }) => {
  return (
    <div className="col-span-6 row-span-5 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
        {!hasStarted ? (
           <div className="max-w-md">
             <h2 className="text-xl font-bold text-slate-200 mb-2">Initialize Orchestration</h2>
             <p className="text-slate-400 text-sm mb-6">
               Start the multi-agent session. The Meta-Orchestrator will initialize the Learner Model and request the first curriculum block from the Content Delivery Agent.
             </p>
             <button 
               onClick={onStart}
               disabled={!apiKey}
               className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Play className="w-5 h-5 fill-current" />
               Start Simulation
             </button>
             {!apiKey && <p className="text-red-400 text-xs mt-3">API Key required (see top right)</p>}
           </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-start items-start text-left">
             <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest border-b border-slate-700 w-full pb-1">System Status</h3>
             <div className="grid grid-cols-2 w-full gap-4 mt-2">
                <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                   <span className="block text-xs text-slate-500 mb-1">Current Constraint Rule</span>
                   <span className="text-sm text-yellow-500 font-mono">Assessment_Precedes_Feedback</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                   <span className="block text-xs text-slate-500 mb-1">Active Route</span>
                   <span className="text-sm text-cyan-400 font-mono">
                     {systemState === SystemState.WAITING_FOR_USER ? "MO -> IDLE" : 
                      systemState === SystemState.DELIVERING_CONTENT ? "MO -> CDA -> USER" :
                      systemState === SystemState.ASSESSING ? "USER -> MO -> LAA" :
                      "MO -> FGA -> USER"}
                   </span>
                </div>
             </div>
             <div className="mt-4 text-xs text-slate-500">
               The Meta-Orchestrator ensures atomic updates to the Learner Model preventing race conditions between the Assessment and Feedback agents.
             </div>
          </div>
        )}
    </div>
  );
};

export default ControlPanel;