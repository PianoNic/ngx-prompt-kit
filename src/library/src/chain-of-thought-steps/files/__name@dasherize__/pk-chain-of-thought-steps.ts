// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideWrench } from '@ng-icons/lucide';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { PkChainOfThoughtImports } from '../chain-of-thought';
import { PkReasoningImports } from '../reasoning';
import { PkCodeBlockImports } from '../code-block';
import { PkMarkdown } from '../markdown';

/** One ordered step in an assistant's chain of thought: a reasoning segment or a
 *  tool call. `type` selects which fields apply. */
export interface PkCotStep {
  type: 'reasoning' | 'tool';
  /** Reasoning text (type === 'reasoning'). */
  text?: string;
  /** Tool name (type === 'tool'). */
  name?: string;
  /** Tool input, rendered as a code block (type === 'tool'). */
  input?: string;
  /** Tool output; `null` while the tool is still running. */
  output?: string | null;
}

/**
 * Renders an assistant's ordered chain of thought: reasoning segments and tool
 * calls interleaved in the order they happened. When there are tool steps it
 * shows a chain-of-thought disclosure per step (a brain icon for reasoning, a
 * spinner/wrench for tools) with reasoning as markdown and tool input/output as
 * code blocks. When it is reasoning only, it shows the reasoning as a single
 * fading/collapsible block instead of a step list.
 */
@Component({
  selector: 'pk-chain-of-thought-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...PkChainOfThoughtImports,
    ...PkReasoningImports,
    ...PkCodeBlockImports,
    PkMarkdown,
    NgIcon,
    HlmSpinner,
  ],
  providers: [provideIcons({ lucideBrain, lucideWrench })],
  host: { class: 'block' },
  template: `
    @if (steps().length > 0) {
      @if (hasTools()) {
        <pk-chain-of-thought>
          @for (step of steps(); track $index; let isLast = $last) {
            <pk-chain-of-thought-step [last]="isLast">
              @if (step.type === 'reasoning') {
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  <ng-icon leftIcon name="lucideBrain" class="text-[length:--spacing(3)]" />
                  {{ reasoningLabel() }}
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    <pk-markdown
                      [content]="step.text ?? ''"
                      class="prose prose-sm dark:prose-invert"
                    />
                  </pk-chain-of-thought-item>
                </pk-chain-of-thought-content>
              } @else {
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  @if (step.output == null) {
                    <hlm-spinner leftIcon class="text-[length:--spacing(3)]" />
                  } @else {
                    <ng-icon leftIcon name="lucideWrench" class="text-[length:--spacing(3)]" />
                  }
                  {{ step.output == null ? runningLabel() : ranLabel() }} {{ step.name }}
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    <pk-code-block>
                      <pk-code-block-code [code]="toolInput(step)" [language]="inputLanguage()" />
                    </pk-code-block>
                  </pk-chain-of-thought-item>
                  @if (step.output != null) {
                    <pk-chain-of-thought-item>
                      <pk-code-block>
                        <pk-code-block-code [code]="step.output" [language]="outputLanguage()" />
                      </pk-code-block>
                    </pk-chain-of-thought-item>
                  }
                </pk-chain-of-thought-content>
              }
            </pk-chain-of-thought-step>
          }
        </pk-chain-of-thought>
      } @else {
        <pk-reasoning [isStreaming]="streaming()">
          <pk-reasoning-trigger>
            <span class="inline-flex items-center gap-1.5">
              <ng-icon name="lucideBrain" class="text-[length:--spacing(3)]" />
              {{ reasoningLabel() }}
            </span>
          </pk-reasoning-trigger>
          <pk-reasoning-content
            [content]="reasoningText()"
            [markdown]="true"
            contentClass="text-xs"
          />
        </pk-reasoning>
      }
    }
  `,
})
export class PkChainOfThoughtSteps {
  public readonly steps = input.required<readonly PkCotStep[]>();
  /** True while the reply is still streaming (auto-opens the reasoning block). */
  public readonly streaming = input<boolean>(false);
  public readonly reasoningLabel = input<string>('Reasoning');
  public readonly runningLabel = input<string>('Running');
  public readonly ranLabel = input<string>('Ran');
  public readonly inputLanguage = input<string>('javascript');
  public readonly outputLanguage = input<string>('text');

  protected readonly hasTools = computed(() => this.steps().some((s) => s.type === 'tool'));

  /** Concatenated reasoning text, for the reasoning-only fading view. */
  protected readonly reasoningText = computed(() =>
    this.steps()
      .filter((s) => s.type === 'reasoning')
      .map((s) => s.text ?? '')
      .join(''),
  );

  /** If the input is JSON with a `code` field (e.g. a JS runner), show the code;
   *  otherwise the raw input. */
  protected toolInput(step: PkCotStep): string {
    const input = step.input ?? '';
    try {
      const args = JSON.parse(input) as Record<string, unknown>;
      if (typeof args['code'] === 'string') return args['code'];
    } catch {
      // fall through to raw input
    }
    return input;
  }
}
