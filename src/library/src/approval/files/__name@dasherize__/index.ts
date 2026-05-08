// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { PkApproval } from './pk-approval';
import { PkApprovalParameter } from './pk-approval-parameter';

export * from './pk-approval';
export * from './pk-approval-parameter';
export * from './pk-approval-types';

export const PkApprovalImports = [PkApproval, PkApprovalParameter] as const;
