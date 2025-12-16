import React, { useEffect, useRef } from 'react';
import { LogEntry, AgentRole } from '../types';
import { Terminal, ArrowRight } from 'lucide-react';

interface LogBusProps {
  logs: LogEntry[];
}

const LogBus: React.FC<LogBusProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'meta': return 'text-cyan-400 italic border-l-2 border-cyan-800 bg-cyan-950/30';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg flex flex-col h-full font-mono text-xs overflow-hidden shadow-inner">
      <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-slate-500" />
        <span className="font-semibold text-slate-400">Event-Driven Message Bus</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 && <div className="text-slate-600 text-center mt-10">System Initializing...</div>}
        
        {logs.map((log) => (
          <div key={log.id} className={`p-2 rounded w-full break-words ${getLogStyle(log.type)}`}>
            <div className="flex items-center gap-2 mb-1 text-[10px] uppercase tracking-wider opacity-70">
              <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={`font-bold ${log.type === 'meta' ? 'text-cyan-500' : 'text-purple-400'}`}>{log.source}</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-400">{log.target}</span>
            </div>
            <div className="pl-2">
               {log.type === 'meta' && <span className="bg-cyan-900 text-cyan-200 px-1 rounded mr-2 text-[9px]">META</span>}
               {log.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogBus;