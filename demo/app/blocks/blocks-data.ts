export interface BlockMeta {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export const BLOCKS: readonly BlockMeta[] = [
  {
    slug: 'empty-state',
    title: 'Empty-state onboarding',
    description: 'First-message experience: hero, suggestion grid, and prompt input wired together.',
  },
  {
    slug: 'streaming-message',
    title: 'Streaming assistant message',
    description: 'Live response with markdown, fenced code, and a stream-controls button.',
  },
  {
    slug: 'tool-approval',
    title: 'Tool call approval flow',
    description: 'Agent proposes a tool, user approves, then the steps timeline shows execution.',
  },
  {
    slug: 'reasoning-pane',
    title: 'Reasoning / thinking pane',
    description: '"Show your work" pattern: a thinking bar collapses into a chain-of-thought timeline.',
  },
  {
    slug: 'branch-edit',
    title: 'Branch navigation + edit',
    description: 'Edit a sent message to re-prompt; navigate sibling responses with branch-nav.',
  },
  {
    slug: 'attachment-compose',
    title: 'Attachments above input',
    description: 'Drop files anywhere or click attach; staged chips render above the textarea.',
  },
  {
    slug: 'sidebar-header',
    title: 'Sidebar header',
    description: 'Persistent left rail: conversation list, active model, and usage at a glance.',
  },
  {
    slug: 'source-citations',
    title: 'Source-attributed answer (RAG)',
    description: 'Assistant message with inline citations that hover-preview the source.',
  },
  {
    slug: 'cost-meter',
    title: 'Cost + token meter',
    description: 'Compose footer: live token count, running cost, and budget threshold colour.',
  },
  {
    slug: 'system-retry',
    title: 'System notice + retry',
    description: 'Stream error → system message → retry control → ask for feedback after recovery.',
  },
  {
    slug: 'chat-thread',
    title: 'Scrollable chat thread',
    description: 'Auto-sticky scroll thread with floating back-to-bottom button.',
  },
  {
    slug: 'model-marketplace',
    title: 'Model marketplace',
    description: 'OpenRouter-style split-pane model picker with search, filters, and pricing detail.',
  },
  {
    slug: 'image-result',
    title: 'Image generation result',
    description: 'Assistant returns a grid of generated images via base64 payloads.',
  },
  {
    slug: 'voice-input',
    title: 'Voice input',
    description: 'Mic button toggles recording; text-shimmer overlays during transcription.',
  },
  {
    slug: 'code-review',
    title: 'Code review thread',
    description: 'User pastes a snippet; assistant returns markdown commentary + a suggested diff.',
  },
  {
    slug: 'setup-tour',
    title: 'Onboarding tour',
    description: 'First-run hero plus a setup checklist driven by chat-empty + steps.',
  },
  {
    slug: 'agent-task',
    title: 'Long-running agent task',
    description: 'Thinking bar + chain-of-thought + live tool card during a multi-step agent run.',
  },
  {
    slug: 'notification-stack',
    title: 'Notification stack',
    description: 'Toast centre composed of dismissible system-message rows of mixed variants.',
  },
  {
    slug: 'markdown-showcase',
    title: 'Markdown showcase',
    description: 'One reply with headings, fenced code, LaTeX math, and a Mermaid diagram.',
  },
  {
    slug: 'regenerate-variants',
    title: 'Regenerate variants',
    description: 'Tone presets via prompt-suggestion chips swap the assistant message in place.',
  },
  {
    slug: 'ai-plan',
    title: 'AI-driven plan',
    description: 'Agent emits a pk-todo-list, ticks items off as it executes, auto-collapses on done.',
  },
];
