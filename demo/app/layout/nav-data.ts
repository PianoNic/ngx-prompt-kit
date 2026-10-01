export interface NavLink {
  label: string;
  path: string;
  badge?: string;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

export const NAV: NavGroup[] = [
  {
    heading: 'Get Started',
    links: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/installation' },
      { label: 'Spartan Replacements', path: '/spartan-replacements', badge: 'New' },
    ],
  },
  {
    heading: 'Showcase',
    links: [
      { label: 'Blocks', path: '/blocks' },
      { label: 'Full Chat', path: '/showcase/full-chat' },
    ],
  },
  {
    heading: 'Components',
    links: [
      { label: 'Approval', path: '/components/approval', badge: 'New' },
      { label: 'Attachment Preview', path: '/components/attachment-preview', badge: 'New' },
      { label: 'Branch Nav', path: '/components/branch-nav', badge: 'New' },
      { label: 'Chain Of Thought', path: '/components/chain-of-thought' },
      { label: 'Chat Container', path: '/components/chat-container' },
      { label: 'Chat Turn', path: '/components/chat-turn', badge: 'New' },
      { label: 'Code Block', path: '/components/code-block' },
      { label: 'Composer', path: '/components/composer', badge: 'New' },
      { label: 'Conversation List', path: '/components/conversation-list', badge: 'New' },
      { label: 'Cost Display', path: '/components/cost-display', badge: 'New' },
      { label: 'Feedback Bar', path: '/components/feedback-bar' },
      { label: 'File Upload', path: '/components/file-upload' },
      { label: 'Image', path: '/components/image' },
      { label: 'Markdown', path: '/components/markdown' },
      { label: 'Message Actions Bar', path: '/components/message-actions-bar', badge: 'New' },
      { label: 'Message Edit', path: '/components/message-edit', badge: 'New' },
      { label: 'Model Browser', path: '/components/model-browser', badge: 'New' },
      { label: 'Model Selector', path: '/components/model-selector', badge: 'New' },
      { label: 'Prompt Suggestion', path: '/components/prompt-suggestion' },
      { label: 'Reasoning', path: '/components/reasoning' },
      { label: 'Reasoning Selector', path: '/components/reasoning-selector', badge: 'New' },
      { label: 'Response Stream', path: '/components/response-stream' },
      { label: 'Source', path: '/components/source' },
      { label: 'Steps', path: '/components/steps' },
      { label: 'Token Counter', path: '/components/token-counter', badge: 'New' },
      { label: 'Tool', path: '/components/tool' },
      { label: 'Tool Steps', path: '/components/tool-steps', badge: 'New' },
      { label: 'Usage Card', path: '/components/usage-card', badge: 'New' },
    ],
  },
  {
    heading: 'Utilities',
    links: [
      { label: 'Streaming (SSE)', path: '/utilities/streaming', badge: 'New' },
      { label: 'Streaming Message', path: '/utilities/streaming-message', badge: 'New' },
      { label: 'HTTP Error', path: '/utilities/http-error', badge: 'New' },
      { label: 'Model Icon', path: '/utilities/model-icon', badge: 'New' },
      { label: 'Auth Image', path: '/utilities/auth-image', badge: 'New' },
      { label: 'Chat Stream', path: '/utilities/chat-stream', badge: 'New' },
    ],
  },
];
