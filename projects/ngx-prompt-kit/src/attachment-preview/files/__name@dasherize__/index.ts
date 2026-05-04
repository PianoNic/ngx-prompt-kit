// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { PkAttachmentChip } from './pk-attachment-chip';
import { PkAttachmentPreview } from './pk-attachment-preview';

export * from './pk-attachment-chip';
export * from './pk-attachment-preview';
export * from './pk-attachment-types';

export const PkAttachmentPreviewImports = [PkAttachmentPreview, PkAttachmentChip] as const;
