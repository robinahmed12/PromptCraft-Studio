export interface Session {
  id: string;
  title: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  responseFormat: "text" | "json_object";
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  sessionId: string;
  role: "system" | "user" | "assistant";
  content: string;
  structuredData?: any;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  createdAt: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  metrics: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    isMock: boolean;
  };
}

export interface HealthResponse {
  status: "healthy" | "degraded";
  database: {
    provider: string;
    connected: boolean;
    message: string;
  };
  llm: {
    provider: string;
    mode: string;
    model?: string;
  };
  timestamp: string;
}
