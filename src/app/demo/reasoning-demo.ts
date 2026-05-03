import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PkReasoningImports } from 'prompt-kit-ng';

@Component({
  selector: 'app-reasoning-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkReasoningImports],
  template: `
    <h2 class="text-xl font-semibold mb-4">Reasoning</h2>
    <pk-reasoning class="block max-w-xl rounded border p-4">
      <pk-reasoning-trigger>Show reasoning</pk-reasoning-trigger>
      <pk-reasoning-content
        [markdown]="true"
        content="The answer is **42**. Here's the chain of thought:
1. Considered the question.
2. Recalled Hitchhiker's Guide.
3. Returned the canonical answer."
      />
    </pk-reasoning>
  `,
})
export class ReasoningDemo {}
