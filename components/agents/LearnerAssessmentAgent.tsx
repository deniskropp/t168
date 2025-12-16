import React, { useEffect } from 'react';
import { runLAA } from '../../services/geminiService';
import { AgentRole, ChatMessage, LearnerState, LAAResponse, LogEntry } from '../../types';

interface LearnerAssessmentAgentProps {
  isActive: boolean;
  input: string;
  topic: string;
  history: ChatMessage[];
  onComplete: (response: LAAResponse) => void;
  onError: (error: any) => void;
  log: (source: AgentRole, target: AgentRole | 'System', action: string, details: string, type?: LogEntry['type']) => void;
}

const LearnerAssessmentAgent: React.FC<LearnerAssessmentAgentProps> = ({
  isActive,
  input,
  topic,
  history,
  onComplete,
  onError,
  log
}) => {
  useEffect(() => {
    if (!isActive || !input) return;

    const performAssessment = async () => {
      try {
        const assessment = await runLAA(input, history, topic);
        
        // Agent Self-Reflection (Meta)
        log(AgentRole.LAA, AgentRole.MO, 'META_CRITIQUE', assessment.critique, 'meta');
        
        onComplete(assessment);
      } catch (error) {
        onError(error);
      }
    };

    performAssessment();
  }, [isActive, input, topic, history, onComplete, onError, log]);

  return null; // Logic-only component
};

export default LearnerAssessmentAgent;