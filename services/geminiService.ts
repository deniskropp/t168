import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LearnerState, ChatMessage, AgentRole, LAAResponse, FGAResponse, CDAResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas for structured output
const laaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: { type: Type.STRING, description: "Detailed analysis of the learner's answer." },
    masteryDelta: { type: Type.INTEGER, description: "Change in mastery score (-10 to +10)." },
    frustrationDelta: { type: Type.INTEGER, description: "Change in frustration score (-10 to +10)." },
    critique: { type: Type.STRING, description: "Self-reflection: Critique of the assessment accuracy." },
  },
  required: ["analysis", "masteryDelta", "frustrationDelta", "critique"],
};

const fgaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    feedback: { type: Type.STRING, description: "Constructive and motivational feedback for the learner." },
    impactPrediction: { type: Type.STRING, description: "Self-reflection: Predicted impact of this feedback." },
  },
  required: ["feedback", "impactPrediction"],
};

const cdaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: { type: Type.STRING, description: "The educational content or question to present." },
    rationale: { type: Type.STRING, description: "Self-reflection: Rationale for choosing this content based on state." },
  },
  required: ["content", "rationale"],
};

export const runLAA = async (
  learnerInput: string,
  context: ChatMessage[],
  currentTopic: string
): Promise<LAAResponse> => {
  const ai = getAI();
  const prompt = `
    You are the Learner Assessment Agent (LAA).
    Context: Topic is "${currentTopic}".
    Task: Analyze the learner's input: "${learnerInput}".
    History: ${JSON.stringify(context.slice(-3))}
    
    Determine if the answer is correct or incorrect. 
    Estimate changes to mastery and frustration.
    Provide a meta-critique of your own assessment logic.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: laaSchema,
      temperature: 0.2,
    },
  });

  return JSON.parse(response.text || "{}");
};

export const runFGA = async (
  assessment: string,
  learnerState: LearnerState
): Promise<FGAResponse> => {
  const ai = getAI();
  const prompt = `
    You are the Feedback Generation Agent (FGA).
    Assessment from LAA: "${assessment}".
    Learner State: Mastery ${learnerState.mastery}%, Frustration ${learnerState.frustration}%.
    
    Task: Generate helpful, encouraging feedback. If frustration is high (>60), be very supportive.
    Provide a meta-evaluation of why this feedback will work.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: fgaSchema,
      temperature: 0.7,
    },
  });

  return JSON.parse(response.text || "{}");
};

export const runCDA = async (
  learnerState: LearnerState,
  recentFeedback: string
): Promise<CDAResponse> => {
  const ai = getAI();
  const prompt = `
    You are the Content Delivery Agent (CDA).
    Topic: "${learnerState.topic}".
    Current Mastery: ${learnerState.mastery}%.
    Recent Feedback: "${recentFeedback}".
    
    Task: Generate the next short lesson segment or question.
    - If mastery is low, make it simple.
    - If mastery is high, make it challenging.
    Provide a rationale for your choice.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: cdaSchema,
      temperature: 0.5,
    },
  });

  return JSON.parse(response.text || "{}");
};
