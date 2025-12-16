import React, { useState, useRef, useCallback } from 'react';
import { AgentRole, SystemState, LearnerState, ChatMessage, LogEntry, LAAResponse, FGAResponse, CDAResponse } from './types';
import LogBus from './components/LogBus';
import StatsPanel from './components/StatsPanel';
import Header from './components/Header';
import OrchestrationVisualizer from './components/OrchestrationVisualizer';
import ChatInterface from './components/ChatInterface';
import ControlPanel from './components/ControlPanel';
import ApiKeyModal from './components/ApiKeyModal';

// Agent Components
import LearnerAssessmentAgent from './components/agents/LearnerAssessmentAgent';
import FeedbackGenerationAgent from './components/agents/FeedbackGenerationAgent';
import ContentDeliveryAgent from './components/agents/ContentDeliveryAgent';

const INITIAL_TOPIC = "Grundlagen der künstlichen Intelligenz";

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [learnerState, setLearnerState] = useState<LearnerState>({
    mastery: 10,
    frustration: 0,
    topic: INITIAL_TOPIC,
    history: []
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(true);
  
  // Transient state for passing data between agents
  const [pendingUserText, setPendingUserText] = useState<string>('');
  const [pendingAssessment, setPendingAssessment] = useState<string>('');
  const [pendingContext, setPendingContext] = useState<string>('');

  const hasStarted = useRef(false);

  // Helper for logging (memoized to pass to components)
  const addLog = useCallback((source: AgentRole, target: AgentRole | 'System', action: string, details: string, type: 'info' | 'meta' | 'error' | 'success' = 'info') => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source,
      target,
      action,
      details,
      type
    };
    setLogs(prev => [...prev, entry]);
  }, []);

  const addMessage = (role: AgentRole, content: string, metaData?: string) => {
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: Date.now(),
      metaData
    };
    setMessages(prev => [...prev, msg]);
    setLearnerState(prev => ({
      ...prev,
      history: [...prev.history, msg].slice(-10)
    }));
  };

  // --- ORCHESTRATION LOGIC (Meta-Orchestrator) ---

  // 1. Start System
  const startSystem = async () => {
    if (!apiKey) return;
    hasStarted.current = true;
    addLog(AgentRole.MO, 'System', 'INIT', 'System Initializing. Starting orchestration loop.');
    
    // Trigger initial content by setting context and state
    setPendingContext("Beginner introduction");
    setSystemState(SystemState.DELIVERING_CONTENT);
    addLog(AgentRole.MO, AgentRole.CDA, 'REQUEST_CONTENT', `Requesting content for topic: ${INITIAL_TOPIC}.`);
  };

  // 2. Handle User Input
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || systemState !== SystemState.WAITING_FOR_USER) return;

    const userText = input;
    setInput('');
    addMessage(AgentRole.USER, userText);
    addLog(AgentRole.USER, AgentRole.MO, 'INPUT', `User submitted: "${userText.substring(0, 30)}..."`);

    // Route to LAA
    setPendingUserText(userText);
    setSystemState(SystemState.ASSESSING);
    addLog(AgentRole.MO, AgentRole.LAA, 'REQUEST_ASSESSMENT', 'Routing user input for assessment.');
  };

  // 3. Handle Assessment Complete (LAA Callback)
  const handleAssessmentComplete = (assessment: LAAResponse) => {
    // Atomic Update of Learner Model (MO Responsibility)
    const newMastery = Math.min(100, Math.max(0, learnerState.mastery + assessment.masteryDelta));
    const newFrustration = Math.min(100, Math.max(0, learnerState.frustration + assessment.frustrationDelta));
    
    addLog(AgentRole.MO, 'System', 'UPDATE_STATE', `Updating Learner Model: Mastery ${assessment.masteryDelta > 0 ? '+' : ''}${assessment.masteryDelta}, Frustration ${assessment.frustrationDelta > 0 ? '+' : ''}${assessment.frustrationDelta}`);
    
    setLearnerState(prev => ({
      ...prev,
      mastery: newMastery,
      frustration: newFrustration
    }));

    // Route to FGA (Constraint: Assessment must precede Feedback)
    setPendingAssessment(assessment.analysis);
    setSystemState(SystemState.GENERATING_FEEDBACK);
    addLog(AgentRole.MO, AgentRole.FGA, 'REQUEST_FEEDBACK', 'Constraint Check: Assessment complete. Requesting Feedback.');
  };

  // 4. Handle Feedback Complete (FGA Callback)
  const handleFeedbackComplete = (response: FGAResponse) => {
    // Deliver Feedback
    addMessage(AgentRole.FGA, response.feedback, response.impactPrediction);

    // Route to CDA
    setPendingContext(response.feedback); // Use feedback as context for next content
    setSystemState(SystemState.DELIVERING_CONTENT);
    addLog(AgentRole.MO, AgentRole.CDA, 'REQUEST_CONTENT', 'Feedback delivered. Requesting next curriculum block.');
  };

  // 5. Handle Content Complete (CDA Callback)
  const handleContentComplete = (response: CDAResponse) => {
    // Deliver Content
    addMessage(AgentRole.CDA, response.content, response.rationale);
    addLog(AgentRole.CDA, AgentRole.USER, 'DELIVER', 'Delivering educational content.');
    
    // Wait for user
    setSystemState(SystemState.WAITING_FOR_USER);
  };

  const handleError = (source: string, error: any) => {
    console.error(error);
    addLog(AgentRole.MO, 'System', 'ERROR', `${source} failed. Resetting to IDLE.`, 'error');
    setSystemState(SystemState.IDLE);
  };

  // Handle Key Modal Confirmation
  const handleKeyConfirm = () => {
    (window as any).process = { env: { API_KEY: apiKey } };
    setShowKeyModal(false);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col font-sans">
      <Header systemState={systemState} />

      {/* ORCHESTRATION AGENTS (HEADLESS / LOGIC CONTROLLERS) */}
      <LearnerAssessmentAgent 
        isActive={systemState === SystemState.ASSESSING}
        input={pendingUserText}
        topic={learnerState.topic}
        history={learnerState.history}
        onComplete={handleAssessmentComplete}
        onError={(e) => handleError('LAA', e)}
        log={addLog}
      />
      
      <FeedbackGenerationAgent 
        isActive={systemState === SystemState.GENERATING_FEEDBACK}
        assessmentAnalysis={pendingAssessment}
        learnerState={learnerState}
        onComplete={handleFeedbackComplete}
        onError={(e) => handleError('FGA', e)}
        log={addLog}
      />

      <ContentDeliveryAgent 
        isActive={systemState === SystemState.DELIVERING_CONTENT}
        contextRationale={pendingContext}
        learnerState={learnerState}
        onComplete={handleContentComplete}
        onError={(e) => handleError('CDA', e)}
        log={addLog}
      />

      {/* MAIN UI GRID */}
      <div className="flex-1 overflow-hidden p-4 grid grid-cols-12 grid-rows-12 gap-4">
        
        {/* LEFT COL: STATS & LOGS */}
        <div className="col-span-3 row-span-12 flex flex-col gap-4">
          <div className="h-1/3">
            <StatsPanel state={learnerState} />
          </div>
          <div className="h-2/3">
            <LogBus logs={logs} />
          </div>
        </div>

        {/* MIDDLE COL: VISUALIZATION */}
        <OrchestrationVisualizer systemState={systemState} />

        {/* RIGHT COL: CHAT / INTERACTION */}
        <ChatInterface 
          messages={messages} 
          input={input} 
          onInputChange={setInput} 
          onSubmit={handleUserSubmit} 
          systemState={systemState} 
        />

        {/* BOTTOM MIDDLE: CONTROLS */}
        <ControlPanel 
          hasStarted={hasStarted.current} 
          apiKey={apiKey} 
          onStart={startSystem} 
          systemState={systemState} 
        />
      </div>

      <ApiKeyModal 
        isOpen={showKeyModal} 
        apiKey={apiKey} 
        setApiKey={setApiKey} 
        onConfirm={handleKeyConfirm} 
      />
    </div>
  );
};

export default App;