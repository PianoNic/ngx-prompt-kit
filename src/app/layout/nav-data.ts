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
      { label: 'Message', path: '/components/message' },
      { label: 'Markdown', path: '/components/markdown' },
      { label: 'Code Block', path: '/components/code-block' },
      { label: 'Prompt Input', path: '/components/prompt-input' },
      { label: 'Response Stream', path: '/components/response-stream' },
      { label: 'Loader', path: '/components/loader' },
      { label: 'Chat Container', path: '/components/chat-container' },
      { label: 'Scroll Button', path: '/components/scroll-button' },
      { label: 'Prompt Suggestion', path: '/components/prompt-suggestion' },
      { label: 'File Upload', path: '/components/file-upload' },
      { label: 'Reasoning', path: '/components/reasoning' },
    ],
  },
];
