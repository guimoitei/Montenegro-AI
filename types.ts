
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isCode?: boolean;
  isMath?: boolean;
}

export enum AgentMode {
  CODE = 'CODE',
  MATH = 'MATH',
  GENERAL = 'GENERAL'
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  mode: AgentMode;
}
