// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { PkAssistantTurn } from './pk-assistant-turn';
import { PkUserTurn } from './pk-user-turn';

export * from './pk-assistant-turn';
export * from './pk-user-turn';

export const PkChatTurnImports = [PkUserTurn, PkAssistantTurn] as const;
