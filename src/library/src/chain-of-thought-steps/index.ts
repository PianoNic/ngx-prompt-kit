import { buildComponent } from '../_lib/component-rule';
export const chainOfThoughtSteps = buildComponent({
  name: 'chain-of-thought-steps',
  needsComponents: ['chain-of-thought', 'reasoning', 'code-block', 'markdown'],
});
