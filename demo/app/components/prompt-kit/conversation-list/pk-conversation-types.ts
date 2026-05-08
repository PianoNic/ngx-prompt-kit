// ngx-prompt-kit original — not part of ibelick/prompt-kit
export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date | string;
  preview?: string;
}

export type ConversationGroupKey = 'today' | 'yesterday' | 'last7' | 'older';

export interface ConversationGroup {
  key: ConversationGroupKey;
  label: string;
  items: Conversation[];
}
