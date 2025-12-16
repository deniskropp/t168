import React, { useEffect } from 'react';
import { runCDA } from '../../services/geminiService';
import { AgentRole, LearnerState, CDAResponse, LogEntry } from '../../types';

interface ContentDeliveryAgentProps {
  isActive: boolean;
  contextRationale: string;
  learnerState: LearnerState;
  onComplete: (response: CDAResponse) => void;
  onError: (error: any) => void;
  log: (source: AgentRole, target: AgentRole | 'System', action: string, details: string, type?: LogEntry['type']) => void;
}

const ContentDeliveryAgent: React.FC<ContentDeliveryAgentProps> = ({
  isActive,
  contextRationale,
  learnerState,
  onComplete,
  onError,
  log
}) => {
  useEffect(() => {
    if (!isActive || !contextRationale) return;

    const deliverContent = async () => {
      try {
        const response = await runCDA(learnerState, contextRationale);
        
        // Agent Self-Reflection (Meta)
        log(AgentRole.CDA, AgentRole.MO, 'META_RATIONALE', response.rationale, 'meta');
        
        onComplete(response);
      } catch (error) {
        onError(error);
      }
    };

    deliverContent();
  }, [isActive, contextRationale, learnerState, onComplete, onError, log]);

  return null; // Logic-only component
};

export default ContentDeliveryAgent;