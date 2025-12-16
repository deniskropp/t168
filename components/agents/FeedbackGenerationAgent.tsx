import React, { useEffect } from 'react';
import { runFGA } from '../../services/geminiService';
import { AgentRole, LearnerState, FGAResponse, LogEntry } from '../../types';

interface FeedbackGenerationAgentProps {
  isActive: boolean;
  assessmentAnalysis: string;
  learnerState: LearnerState;
  onComplete: (response: FGAResponse) => void;
  onError: (error: any) => void;
  log: (source: AgentRole, target: AgentRole | 'System', action: string, details: string, type?: LogEntry['type']) => void;
}

const FeedbackGenerationAgent: React.FC<FeedbackGenerationAgentProps> = ({
  isActive,
  assessmentAnalysis,
  learnerState,
  onComplete,
  onError,
  log
}) => {
  useEffect(() => {
    if (!isActive || !assessmentAnalysis) return;

    const generateFeedback = async () => {
      try {
        const response = await runFGA(assessmentAnalysis, learnerState);
        
        // Agent Self-Reflection (Meta)
        log(AgentRole.FGA, AgentRole.MO, 'META_IMPACT', response.impactPrediction, 'meta');
        
        onComplete(response);
      } catch (error) {
        onError(error);
      }
    };

    generateFeedback();
  }, [isActive, assessmentAnalysis, learnerState, onComplete, onError, log]);

  return null; // Logic-only component
};

export default FeedbackGenerationAgent;