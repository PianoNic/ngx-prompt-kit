// ngx-prompt-kit original — not part of ibelick/prompt-kit
export interface MessageAction {
  /** Stable id used by track-by and emitted from (actionPicked). */
  id: string;
  /** Tooltip + aria-label text. */
  label: string;
  /** Lucide icon name registered via provideIcons() at the consumer level. */
  icon: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  /** When true, the button gets bg-accent + text-primary to signal "engaged" (e.g. thumbs-up after click). */
  active?: boolean;
}

/** ChatGPT-style assistant toolbar: copy, regenerate, thumbs-up, thumbs-down. */
export const DEFAULT_ASSISTANT_ACTIONS: readonly MessageAction[] = [
  { id: 'copy', label: 'Copy', icon: 'lucideCopy' },
  { id: 'regenerate', label: 'Regenerate', icon: 'lucideRefreshCw' },
  { id: 'thumbs-up', label: 'Good response', icon: 'lucideThumbsUp' },
  { id: 'thumbs-down', label: 'Bad response', icon: 'lucideThumbsDown' },
] as const;

/** Standard user-message toolbar: copy + edit. */
export const DEFAULT_USER_ACTIONS: readonly MessageAction[] = [
  { id: 'copy', label: 'Copy', icon: 'lucideCopy' },
  { id: 'edit', label: 'Edit', icon: 'lucidePencil' },
] as const;
