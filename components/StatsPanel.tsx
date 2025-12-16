import React from 'react';
import { LearnerState } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsPanelProps {
  state: LearnerState;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ state }) => {
  const data = [
    { name: 'Mastery', value: state.mastery, color: '#8b5cf6' }, // Purple
    { name: 'Frustration', value: state.frustration, color: '#f43f5e' }, // Rose
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Learner Model (Internal State)</h3>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#e2e8f0' }}
              cursor={{fill: 'transparent'}}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-800 pt-3">
        <div>
           Topic: <span className="text-slate-300 font-medium">{state.topic}</span>
        </div>
        <div>
           State: <span className="text-slate-300 font-medium">{state.frustration > 60 ? 'Frustrated' : 'Engaged'}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;