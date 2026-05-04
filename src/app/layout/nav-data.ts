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
      { label: 'Chain Of Thought', path: '/components/chain-of-thought' },
      { label: 'Chat Container', path: '/components/chat-container' },
      { label: 'Chat Empty', path: '/components/chat-empty', badge: 'New' },
      { label: 'Code Block', path: '/components/code-block' },
      { label: 'Conversation List', path: '/components/conversation-list', badge: 'New' },
      { label: 'Cost Display', path: '/components/cost-display', badge: 'New' },
      { label: 'Feedback Bar', path: '/components/feedback-bar' },
      { label: 'File Upload', path: '/components/file-upload' },
      { label: 'Image', path: '/components/image' },
      { label: 'Loader', path: '/components/loader' },
      { label: 'Markdown', path: '/components/markdown' },
      { label: 'Message', path: '/components/message' },
      { label: 'Message Edit', path: '/components/message-edit', badge: 'New' },
      { label: 'Prompt Input', path: '/components/prompt-input' },
      { label: 'Prompt Suggestion', path: '/components/prompt-suggestion' },
      { label: 'Reasoning', path: '/components/reasoning' },
      { label: 'Response Stream', path: '/components/response-stream' },
      { label: 'Scroll Button', path: '/components/scroll-button' },
      { label: 'Source', path: '/components/source' },
      { label: 'Steps', path: '/components/steps' },
      { label: 'Stream Controls', path: '/components/stream-controls', badge: 'New' },
      { label: 'System Message', path: '/components/system-message' },
      { label: 'Text Shimmer', path: '/components/text-shimmer' },
      { label: 'Thinking Bar', path: '/components/thinking-bar' },
      { label: 'Token Counter', path: '/components/token-counter', badge: 'New' },
      { label: 'Tool', path: '/components/tool' },
    ],
  },
];
