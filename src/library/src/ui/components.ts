// Source of truth for which schematic names are user-facing components.
// `ng-add`, `init`, `ui`, and `utils` are excluded — `utils` is chained
// automatically by component schematics that need it.
export const PROMPT_KIT_COMPONENTS = [
  'approval',
  'attachment-preview',
  'branch-nav',
  'chain-of-thought',
  'chat-container',
  'code-block',
  'conversation-list',
  'cost-display',
  'feedback-bar',
  'file-upload',
  'image',
  'markdown',
  'message-actions-bar',
  'message-edit',
  'model-browser',
  'model-list',
  'model-picker',
  'model-selector',
  'composer',
  'chat-turn',
  'prompt-suggestion',
  'reasoning',
  'response-stream',
  'source',
  'steps',
  'stream-controls',
  'thinking-bar',
  'token-counter',
  'tool',
  'usage-card',
] as const;

export type PromptKitComponent = (typeof PROMPT_KIT_COMPONENTS)[number];

export function isKnownComponent(name: string): name is PromptKitComponent {
  return (PROMPT_KIT_COMPONENTS as readonly string[]).includes(name);
}
