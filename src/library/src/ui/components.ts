// Source of truth for which schematic names are user-facing components.
// `ng-add`, `init`, `ui`, and `utils` are excluded — `utils` is chained
// automatically by component schematics that need it.
export const PROMPT_KIT_COMPONENTS = [
  'approval',
  'attachment-preview',
  'branch-nav',
  'chain-of-thought',
  'chat-container',
  'chat-empty',
  'code-block',
  'conversation-list',
  'cost-display',
  'feedback-bar',
  'file-upload',
  'image',
  'loader',
  'markdown',
  'message',
  'message-actions-bar',
  'message-edit',
  'model-browser',
  'model-list',
  'model-picker',
  'prompt-input',
  'prompt-suggestion',
  'reasoning',
  'response-stream',
  'scroll-button',
  'source',
  'steps',
  'stream-controls',
  'system-message',
  'text-shimmer',
  'thinking-bar',
  'token-counter',
  'tool',
  'usage-card',
] as const;

export type PromptKitComponent = (typeof PROMPT_KIT_COMPONENTS)[number];

export function isKnownComponent(name: string): name is PromptKitComponent {
  return (PROMPT_KIT_COMPONENTS as readonly string[]).includes(name);
}
