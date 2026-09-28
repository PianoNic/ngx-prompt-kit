// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { PkComposer } from './pk-composer';
import { PkComposerDock } from './pk-composer-dock';

export * from './pk-composer';
export * from './pk-composer-dock';

export const PkComposerImports = [PkComposer, PkComposerDock] as const;
