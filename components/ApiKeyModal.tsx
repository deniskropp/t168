import React from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  onConfirm: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, apiKey, setApiKey, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-slate-400 mb-6 text-sm">
          This simulation uses Gemini 2.5 Flash to simulate four distinct cognitive agents. Please enter your Google GenAI API Key to proceed.
        </p>
        <input
          type="password"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
        />
         <div className="flex gap-3">
          <button 
            onClick={onConfirm}
            disabled={!apiKey}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            Enter Simulation
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-4 text-center">
          Keys are not stored. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-400">Get an API key</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;