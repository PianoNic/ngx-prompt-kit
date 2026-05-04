// ngx-prompt-kit original — not part of ibelick/prompt-kit
export type ApprovalSeverity = 'info' | 'warning' | 'destructive';

export interface ApprovalParameter {
  label: string;
  value: string;
  /** When true (default), long values get text-ellipsis truncation. */
  truncate?: boolean;
}
