import { buildComponent } from '../_lib/component-rule';
export const toolSteps = buildComponent({
  name: 'tool-steps',
  needsUtils: true,
  needsComponents: ['chain-of-thought', 'code-block'],
});
