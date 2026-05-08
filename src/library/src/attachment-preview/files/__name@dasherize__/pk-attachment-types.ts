// ngx-prompt-kit original — not part of ibelick/prompt-kit
export type AttachmentType = 'image' | 'file' | 'audio' | 'video';

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  /** Bytes. Optional — not all sources expose size up front. */
  size?: number;
  /** For type='image' — URL or data URI for the inline thumbnail. */
  thumbnailUrl?: string;
  mimeType?: string;
}

/** Locale-aware byte formatter. Picks the largest unit that keeps the value ≥ 1. */
export function formatAttachmentSize(bytes: number, locale?: string): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'] as const;
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  return `${fmt.format(value)} ${units[i]}`;
}
