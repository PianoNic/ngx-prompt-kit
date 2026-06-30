// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';
import { PkChainOfThoughtImports } from '../chain-of-thought';
import { PkCodeBlockImports } from '../code-block';

/** One tool invocation in an assistant's chain of thought. */
export interface PkToolStep {
  /** Tool name shown in the disclosure trigger. */
  name: string;
  /** Input/arguments rendered as a code block. */
  input: string;
  /** Output rendered as a second code block. `null` means still running,
   *  which switches the trigger label from "Ran" to "Running". */
  output: string | null;
}

/**
 * Renders an assistant's tool trace — a `chain-of-thought` disclosure per step
 * with the input (and, once present, the output) shown as code blocks. Pass the
 * same `steps` array while streaming and after committing; steps with a `null`
 * output read as "Running …" and flip to "Ran …" when the output arrives.
 */
@Component({
  selector: 'pk-tool-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...PkChainOfThoughtImports, ...PkCodeBlockImports],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (steps().length > 0) {
      <pk-chain-of-thought>
        @for (step of steps(); track $index; let isLast = $last) {
          <pk-chain-of-thought-step [last]="isLast">
            <pk-chain-of-thought-trigger>
              {{ step.output === null ? runningLabel() : ranLabel() }} {{ step.name }}
            </pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                <pk-code-block>
                  <pk-code-block-code [code]="step.input" [language]="inputLanguage()" />
                </pk-code-block>
              </pk-chain-of-thought-item>
              @if (step.output !== null) {
                <pk-chain-of-thought-item>
                  <pk-code-block>
                    <pk-code-block-code [code]="step.output" [language]="outputLanguage()" />
                  </pk-code-block>
                </pk-chain-of-thought-item>
              }
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>
        }
      </pk-chain-of-thought>
    }
  `,
})
export class PkToolSteps {
  public readonly steps = input.required<readonly PkToolStep[]>();
  /** Shiki language for the input code block. */
  public readonly inputLanguage = input<string>('javascript');
  /** Shiki language for the output code block. */
  public readonly outputLanguage = input<string>('text');
  /** Trigger prefix while a step is running (output is `null`). */
  public readonly runningLabel = input<string>('Running');
  /** Trigger prefix once a step has finished. */
  public readonly ranLabel = input<string>('Ran');
  public readonly class = input<string>('');

  protected readonly hostClass = computed(() => cn('block', this.class()));
}
