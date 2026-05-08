import { buildComponent } from '../_lib/component-rule';
export const markdown = buildComponent({
  name: 'markdown',
  needsUtils: true,
  extraDeps: {
    marked: '^18.0.3',
    katex: '^0.16.11',
    '@types/katex': '^0.16.8',
    mermaid: '^11.4.0',
  },
});
