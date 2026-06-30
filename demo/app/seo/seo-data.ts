// Single source of truth for per-route SEO metadata. Both SeoService
// (runtime <head> updates) and scripts/generate-sitemap.js read from here.
import { BLOCKS } from '../blocks/blocks-data';

export const SITE = {
  name: 'ngx-prompt-kit',
  baseUrl: 'https://ngx-prompt-kit.pianonic.ch',
  defaultDescription:
    'Angular components for AI chat interfaces. Composes with Spartan UI. Distributed via schematics — own the source.',
  /** Path under public/ used as the default OG/Twitter image. */
  defaultOgImage: '/icon.svg',
  twitterHandle: '@PianoNic',
  themeColorLight: '#FAFAFA',
  themeColorDark: '#0A0A0A',
};

export interface PageMeta {
  /** Full document title — already includes the suffix. */
  title: string;
  description: string;
  /** Path-relative URL, leading slash. */
  path: string;
  /** Optional path-relative OG image (overrides defaultOgImage). */
  ogImage?: string;
  /** Hint for sitemap.xml. */
  changefreq?: 'daily' | 'weekly' | 'monthly';
  /** Hint for sitemap.xml. */
  priority?: number;
}

const COMPONENT_TITLES: Readonly<Record<string, string>> = {
  approval: 'Approval',
  'attachment-preview': 'Attachment Preview',
  'branch-nav': 'Branch Nav',
  'chain-of-thought': 'Chain Of Thought',
  'chat-container': 'Chat Container',
  'chat-empty': 'Chat Empty',
  'code-block': 'Code Block',
  'conversation-list': 'Conversation List',
  'cost-display': 'Cost Display',
  'feedback-bar': 'Feedback Bar',
  'file-upload': 'File Upload',
  image: 'Image',
  loader: 'Loader',
  markdown: 'Markdown',
  message: 'Message',
  'message-actions-bar': 'Message Actions Bar',
  'message-edit': 'Message Edit',
  'model-browser': 'Model Browser',
  'model-list': 'Model List',
  'model-picker': 'Model Picker',
  'prompt-input': 'Prompt Input',
  'prompt-suggestion': 'Prompt Suggestion',
  reasoning: 'Reasoning',
  'response-stream': 'Response Stream',
  'scroll-button': 'Scroll Button',
  source: 'Source',
  steps: 'Steps',
  'stream-controls': 'Stream Controls',
  'system-message': 'System Message',
  'text-shimmer': 'Text Shimmer',
  'thinking-bar': 'Thinking Bar',
  'todo-list': 'Todo List',
  'token-counter': 'Token Counter',
  tool: 'Tool',
  'tool-steps': 'Tool Steps',
  'usage-card': 'Usage Card',
};

/** Public list of every prerender-able URL. Read by sitemap generator. */
export const ALL_PAGE_PATHS: readonly string[] = [
  '/',
  '/installation',
  '/blocks',
  ...BLOCKS.map((b) => `/blocks/${b.slug}`),
  '/showcase/full-chat',
  ...Object.keys(COMPONENT_TITLES).map((slug) => `/components/${slug}`),
  '/utilities/streaming',
  '/utilities/streaming-message',
  '/utilities/http-error',
];

/**
 * Resolve the SEO metadata for a router URL. Pure function so the same
 * code runs in the SeoService and in the sitemap generator.
 */
export function metaForUrl(url: string): PageMeta {
  const path = normalize(url);

  if (path === '/') {
    return {
      title: `${SITE.name} — Angular components for AI chat interfaces`,
      description: SITE.defaultDescription,
      path: '/',
      changefreq: 'weekly',
      priority: 1.0,
    };
  }

  if (path === '/installation') {
    return {
      title: `Installation · ${SITE.name}`,
      description:
        'Install ngx-prompt-kit via ng add. Schematics generate Angular component source straight into your project — you own the code.',
      path,
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  if (path === '/blocks') {
    return {
      title: `Blocks gallery · ${SITE.name}`,
      description:
        'Composed UI patterns for AI chat: empty-state onboarding, streaming messages, tool approvals, branch navigation, attachments, source citations, cost meters, and more — copy-pasteable recipes built on ngx-prompt-kit.',
      path,
      changefreq: 'weekly',
      priority: 0.9,
    };
  }

  if (path.startsWith('/blocks/')) {
    const slug = path.slice('/blocks/'.length);
    const block = BLOCKS.find((b) => b.slug === slug);
    if (block) {
      return {
        title: `${block.title} block · ${SITE.name}`,
        description: `${block.description} Live demo + copy-pasteable Angular code.`,
        path,
        ogImage: `/blocks/${slug}-light.jpeg`,
        changefreq: 'monthly',
        priority: 0.7,
      };
    }
  }

  if (path === '/showcase/full-chat') {
    return {
      title: `Full chat showcase · ${SITE.name}`,
      description:
        'A complete AI chat reference UI built end-to-end with ngx-prompt-kit components — message thread, prompt input, streaming responses, conversation list, the works.',
      path,
      changefreq: 'monthly',
      priority: 0.8,
    };
  }

  if (path === '/utilities/streaming') {
    return {
      title: `Streaming (SSE) utility · ${SITE.name}`,
      description:
        'SSE streaming helpers for ngx-prompt-kit — consumeSseFrames() and readSseHttpEvents() turn an Angular HttpClient event stream into per-frame callbacks for AI chat. Schematic command included.',
      path,
      changefreq: 'monthly',
      priority: 0.6,
    };
  }

  if (path === '/utilities/streaming-message') {
    return {
      title: `Streaming Message helper · ${SITE.name}`,
      description:
        'createStreamingMessage() for ngx-prompt-kit — a signal-based controller that coordinates the pk-response-stream reveal handshake (append, done, finished→commit). Schematic command included.',
      path,
      changefreq: 'monthly',
      priority: 0.6,
    };
  }

  if (path === '/utilities/http-error') {
    return {
      title: `HTTP Error helper · ${SITE.name}`,
      description:
        'describeHttpError() for ngx-prompt-kit — maps HttpErrorResponse status codes to friendly, user-facing messages with optional per-status overrides. Schematic command included.',
      path,
      changefreq: 'monthly',
      priority: 0.6,
    };
  }

  if (path.startsWith('/components/')) {
    const slug = path.slice('/components/'.length);
    const title = COMPONENT_TITLES[slug] ?? toTitleCase(slug);
    return {
      title: `${title} component · ${SITE.name}`,
      description: `${title} component for ngx-prompt-kit — Angular AI chat UI primitive. Live examples, full API, and the schematic command to generate it into your workspace.`,
      path,
      changefreq: 'monthly',
      priority: 0.6,
    };
  }

  return {
    title: SITE.name,
    description: SITE.defaultDescription,
    path,
    changefreq: 'monthly',
    priority: 0.4,
  };
}

function normalize(url: string): string {
  let p = url.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}
