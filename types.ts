export enum AgentRole {
  MO = 'Meta-Orchestrator',
  CDA = 'Content Delivery Agent',
  LAA = 'Learner Assessment Agent',
  FGA = 'Feedback Generation Agent',
  USER = 'Learner'
}

export enum SystemState {
  IDLE = 'IDLE',
  ASSESSING = 'ASSESSING', // LAA working
  GENERATING_FEEDBACK = 'GENERATING_FEEDBACK', // FGA working
  DELIVERING_CONTENT = 'DELIVERING_CONTENT', // CDA working
  WAITING_FOR_USER = 'WAITING_FOR_USER'
}

export interface LearnerState {
  mastery: number; // 0 to 100
  frustration: number; // 0 to 100
  topic: string;
  history: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
  metaData?: string; // For self-reflection/rationale
}

export interface LogEntry {
  id: string;
  timestamp: number;
  source: AgentRole;
  target: AgentRole | 'System';
  action: string;
  details: string;
  type: 'info' | 'meta' | 'error' | 'success';
}

// Structured responses from Gemini for specific agents
export interface LAAResponse {
  analysis: string;
  masteryDelta: number;
  frustrationDelta: number;
  critique: string; // Meta-communication
}

export interface FGAResponse {
  feedback: string;
  impactPrediction: string; // Meta-communication
}

export interface CDAResponse {
  content: string;
  rationale: string; // Meta-communication
}