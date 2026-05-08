import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideSearch, lucideTarget } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChainOfThoughtImports } from 'ngx-prompt-kit/chain-of-thought';
import { PkReasoningImports } from 'ngx-prompt-kit/reasoning';
import { PkThinkingBar } from 'ngx-prompt-kit/thinking-bar';

const SUMMARY = `# Verdict
The cycle is between \`refreshSession\` and \`verifyToken\`. Extracting the token-refresh path into its own module breaks the cycle at the import boundary.`;

@Component({
  selector: 'app-block-reasoning-pane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkChainOfThoughtImports,
    PkReasoningImports,
    PkThinkingBar,
  ],
  providers: [provideIcons({ lucideSearch, lucideLightbulb, lucideTarget })],
  template: `
    <app-block-page
      title="Reasoning / thinking pane"
      description="Claude/o1-style 'show your work' surface. While streaming, a thinking bar pulses; once done, it collapses and a chain-of-thought timeline + a markdown summary take over."
    >
      <app-doc-example title="Thinking bar → chain-of-thought → summary" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <button
            hlmBtn
            variant="outline"
            size="sm"
            type="button"
            [disabled]="thinking()"
            (click)="run()"
          >
            {{ thinking() ? 'Thinking…' : 'Re-run' }}
          </button>

          @if (thinking()) {
            <pk-thinking-bar
              text="Inspecting 14 functions"
              stopLabel="Skip"
              [showStop]="true"
              (stopped)="stop()"
              class="max-w-md"
            />
          } @else {
            <pk-chain-of-thought class="max-w-xl">
              <pk-chain-of-thought-step>
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  <ng-icon leftIcon hlm size="xs" name="lucideSearch" />
                  Read the input prompt
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    Parsed 3 paragraphs and 2 code blocks. Detected language: TypeScript.
                  </pk-chain-of-thought-item>
                </pk-chain-of-thought-content>
              </pk-chain-of-thought-step>

              <pk-chain-of-thought-step>
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  <ng-icon leftIcon hlm size="xs" name="lucideLightbulb" />
                  Walk the AST
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    Visited 14 functions, found one cycle in the auth middleware between
                    <code class="font-mono text-xs">refreshSession</code> and
                    <code class="font-mono text-xs">verifyToken</code>.
                  </pk-chain-of-thought-item>
                </pk-chain-of-thought-content>
              </pk-chain-of-thought-step>

              <pk-chain-of-thought-step [last]="true">
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  <ng-icon leftIcon hlm size="xs" name="lucideTarget" />
                  Compose the answer
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    Recommend extracting the token-refresh path into a separate module so the
                    cycle is broken at the import boundary.
                  </pk-chain-of-thought-item>
                </pk-chain-of-thought-content>
              </pk-chain-of-thought-step>
            </pk-chain-of-thought>

            <pk-reasoning [isStreaming]="false">
              <pk-reasoning-trigger>Show summary</pk-reasoning-trigger>
              <pk-reasoning-content
                contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
                [markdown]="true"
                [content]="summary"
              />
            </pk-reasoning>
          }
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class ReasoningPaneBlock {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected readonly thinking = signal(true);
  protected readonly summary = SUMMARY;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
    if (this.isBrowser) {
      this.timer = setTimeout(() => this.thinking.set(false), 2200);
    }
  }

  protected run(): void {
    if (!this.isBrowser) return;
    if (this.timer) clearTimeout(this.timer);
    this.thinking.set(true);
    this.timer = setTimeout(() => this.thinking.set(false), 1800);
  }

  protected stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.thinking.set(false);
  }

  protected readonly code = `@if (thinking()) {
  <pk-thinking-bar
    text="Inspecting 14 functions"
    stopLabel="Skip"
    [showStop]="true"
    (stopped)="stop()"
  />
} @else {
  <pk-chain-of-thought>
    <pk-chain-of-thought-step>
      <pk-chain-of-thought-trigger [leftIcon]="true">
        <ng-icon leftIcon hlm size="xs" name="lucideSearch" />
        Read the input prompt
      </pk-chain-of-thought-trigger>
      <pk-chain-of-thought-content>
        <pk-chain-of-thought-item>Parsed 3 paragraphs.</pk-chain-of-thought-item>
      </pk-chain-of-thought-content>
    </pk-chain-of-thought-step>
    <!-- ...more steps... -->
    <pk-chain-of-thought-step [last]="true">
      <pk-chain-of-thought-trigger [leftIcon]="true">
        <ng-icon leftIcon hlm size="xs" name="lucideTarget" />
        Compose the answer
      </pk-chain-of-thought-trigger>
      <pk-chain-of-thought-content>
        <pk-chain-of-thought-item>Recommend ...</pk-chain-of-thought-item>
      </pk-chain-of-thought-content>
    </pk-chain-of-thought-step>
  </pk-chain-of-thought>

  <pk-reasoning>
    <pk-reasoning-trigger>Show summary</pk-reasoning-trigger>
    <pk-reasoning-content
      contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
      [markdown]="true"
      [content]="summary"
    />
  </pk-reasoning>
}

// Component
protected readonly thinking = signal(true);
protected run(): void {
  this.thinking.set(true);
  setTimeout(() => this.thinking.set(false), 1800);
}`;
}
