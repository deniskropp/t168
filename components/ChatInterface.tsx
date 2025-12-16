import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage, AgentRole, SystemState } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  systemState: SystemState;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  input, 
  onInputChange, 
  onSubmit, 
  systemState 
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

  return (
    <div className="col-span-3 row-span-12 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-950 font-semibold text-slate-300">
        Learner Interface
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
         {messages.length === 0 && (
           <div className="text-center text-slate-600 text-sm mt-10 italic">
             Awaiting System Start...
           </div>
         )}
         {messages.map(msg => (
           <div key={msg.id} className={`flex flex-col ${msg.role === AgentRole.USER ? 'items-end' : 'items-start'}`}>
             <div className={`
               max-w-[90%] p-3 rounded-lg text-sm shadow-sm
               ${msg.role === AgentRole.USER ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}
               ${msg.role === AgentRole.FGA ? 'border-emerald-500/50 border' : ''}
               ${msg.role === AgentRole.CDA ? 'border-blue-500/50 border' : ''}
             `}>
               <div className="text-[10px] opacity-50 mb-1 font-bold">{msg.role}</div>
               {msg.content}
             </div>
             {msg.metaData && (
               <div className="text-[10px] text-cyan-500/70 mt-1 max-w-[85%] px-1">
                 <span className="font-bold">META:</span> {msg.metaData}
               </div>
             )}
           </div>
         ))}
      </div>
      
      <form onSubmit={onSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={systemState === SystemState.WAITING_FOR_USER ? "Type your answer..." : "Please wait..."}
          disabled={systemState !== SystemState.WAITING_FOR_USER}
          className="flex-1 bg-slate-800 border-slate-700 text-slate-200 text-sm rounded focus:ring-2 focus:ring-purple-500 outline-none px-3 py-2 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={systemState !== SystemState.WAITING_FOR_USER || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;