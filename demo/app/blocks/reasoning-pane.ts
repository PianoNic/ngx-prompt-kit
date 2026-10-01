import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideSearch, lucideTarget } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChainOfThoughtImports } from 'ngx-prompt-kit/chain-of-thought';
import { PkReasoningImports } from 'ngx-prompt-kit/reasoning';

const SUMMARY = `# Verdict
The cycle is between \`refreshSession\` and \`verifyToken\`. Extracting the token-refresh path into its own module breaks the cycle at the import boundary.`;

@Component({
  selector: 'app-block-reasoning-pane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, HlmButton, NgIcon, PkChainOfThoughtImports, PkReasoningImports],
  providers: [provideIcons({ lucideSearch, lucideLightbulb, lucideTarget })],
  template: `
    <app-block-page
      title="Reasoning / thinking pane"
      description="Claude/o1-style 'show your work' surface. While streaming, a shimmering status line shows; once done, it collapses and a chain-of-thought timeline + a markdown summary take over."
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
            <div class="flex w-full items-center justify-between max-w-md">
              <span role="status" class="shimmer text-muted-foreground text-sm font-medium"
                >Inspecting 14 functions</span
              >
              <button
                hlmBtn
                variant="link"
                size="sm"
                type="button"
                class="text-muted-foreground"
                (click)="stop()"
              >
                Skip
              </button>
            </div>
          } @else {
            <pk-chain-of-thought class="max-w-xl">
              <pk-chain-of-thought-step>
                <pk-chain-of-thought-trigger [leftIcon]="true">
                  <ng-icon leftIcon name="lucideSearch" class="text-[length:--spacing(3)]" />
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
                  <ng-icon leftIcon name="lucideLightbulb" class="text-[length:--spacing(3)]" />
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
                  <ng-icon leftIcon name="lucideTarget" class="text-[length:--spacing(3)]" />
                  Compose the answer
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    Recommend extracting the token-refresh path into a separate module so the cycle
                    is broken at the import boundary.
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
  <div class="flex w-full items-center justify-between">
    <span role="status" class="shimmer text-muted-foreground text-sm font-medium">Inspecting 14 functions</span>
    <button
      hlmBtn
      variant="link"
      size="sm"
      type="button"
      class="text-muted-foreground"
      (click)="stop()"
    >
      Skip
    </button>
  </div>
} @else {
  <pk-chain-of-thought>
    <pk-chain-of-thought-step>
      <pk-chain-of-thought-trigger [leftIcon]="true">
        <ng-icon leftIcon name="lucideSearch" class="text-[length:--spacing(3)]" />
        Read the input prompt
      </pk-chain-of-thought-trigger>
      <pk-chain-of-thought-content>
        <pk-chain-of-thought-item>Parsed 3 paragraphs.</pk-chain-of-thought-item>
      </pk-chain-of-thought-content>
    </pk-chain-of-thought-step>
    <!-- ...more steps... -->
    <pk-chain-of-thought-step [last]="true">
      <pk-chain-of-thought-trigger [leftIcon]="true">
        <ng-icon leftIcon name="lucideTarget" class="text-[length:--spacing(3)]" />
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
