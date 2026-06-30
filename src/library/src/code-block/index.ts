import { buildComponent } from '../_lib/component-rule';
export const codeBlock = buildComponent({
  name: 'code-block',
  needsUtils: true,
  extraDeps: { shiki: '^4.0.2' },
});
