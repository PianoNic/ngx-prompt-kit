import { buildComponent } from '../_lib/component-rule';
export const markdown = buildComponent({ name: 'markdown', needsUtils: true, extraDeps: { marked: '^18.0.3' } });
