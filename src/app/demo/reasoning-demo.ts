import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkReasoningImports } from 'prompt-kit-ng/reasoning';

const BASIC_REASONING = `I calculated the best color balance for the image:

1. First, I analyzed the color of the car - a deep blue metallic finish
2. Then, I examined the color of the sky - overcast with neutral tones
3. Next, I considered the color of the grass - vibrant green in the foreground
4. I calculated the optimal white balance to enhance all elements
5. Applied selective color adjustments to maintain natural appearance
6. Final result: improved contrast and color harmony`;

const MARKDOWN_REASONING = `# Solving: Square Root of 144

## Step 1: Problem Analysis
I need to find a number that, when **multiplied by itself**, equals 144.

## Step 2: Testing Values
- \`10² = 100\` ❌ (too small)
- \`13² = 169\` ❌ (too large)
- \`12² = 144\` ✅ (perfect!)

## Step 3: Verification
\`\`\`
12 × 12 = 144 ✓
\`\`\`

> **Answer:** The square root of 144 is **12**.`;

@Component({
  selector: 'app-reasoning-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, HlmButton, PkReasoningImports],
  template: `
    <app-doc-page
      title="Reasoning"
      description="A collapsible component for showing AI reasoning, explanations, or logic. Auto-expands while a stream is in progress and collapses when it ends. Markdown supported."
    >
      <app-doc-example
        title="Basic Usage"
        description="The most basic implementation of the Reasoning component with auto-close functionality when streaming ends."
        [code]="basicCode"
      >
        <div class="flex w-full flex-col items-start gap-4">
          <button
            hlmBtn
            variant="outline"
            size="sm"
            type="button"
            [disabled]="basicStreaming()"
            (click)="streamBasic()"
          >
            {{ basicStreaming() ? 'Generating...' : 'Generate Reasoning' }}
          </button>

          <pk-reasoning [isStreaming]="basicStreaming()">
            <pk-reasoning-trigger>Show reasoning</pk-reasoning-trigger>
            <pk-reasoning-content
              contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
              [content]="basicText()"
            />
          </pk-reasoning>
        </div>
      </app-doc-example>

      <app-doc-example
        title="With Markdown"
        description="Show rich formatting with markdown support for better structured reasoning content."
        [code]="markdownCode"
      >
        <div class="flex w-full flex-col items-start gap-4">
          <button
            hlmBtn
            variant="outline"
            size="sm"
            type="button"
            [disabled]="markdownStreaming()"
            (click)="streamMarkdown()"
          >
            {{ markdownStreaming() ? 'Thinking...' : 'Generate Reasoning' }}
          </button>

          <pk-reasoning [isStreaming]="markdownStreaming()">
            <pk-reasoning-trigger>Show AI reasoning</pk-reasoning-trigger>
            <pk-reasoning-content
              contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
              [markdown]="true"
              [content]="markdownText()"
            />
          </pk-reasoning>
        </div>
      </app-doc-example>

      <app-doc-install component="reasoning" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ReasoningDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkReasoning',
      props: [
        { name: 'open', type: 'model<boolean>', description: 'Two-way bound open state. Leave unbound for uncontrolled.' },
        { name: 'isStreaming', type: 'boolean', default: 'false', description: 'Auto-opens while true; auto-closes when it flips back to false.' },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
    {
      name: 'PkReasoningTrigger',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the trigger button.' },
      ],
    },
    {
      name: 'PkReasoningContent',
      props: [
        { name: 'content', type: 'string', description: 'The body text. Optional — projected ng-content also supported.' },
        { name: 'markdown', type: 'boolean', default: 'false', description: 'Render content as markdown via pk-markdown.' },
        { name: 'class', type: 'string', description: 'Extra classes for the outer collapsing wrapper.' },
        { name: 'contentClass', type: 'string', description: 'Extra classes for the inner content (use this for borders / padding so they collapse with the panel).' },
      ],
    },
  ];


  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private timers: ReturnType<typeof setTimeout>[] = [];

  protected readonly basicText = signal('');
  protected readonly basicStreaming = signal(false);
  protected readonly markdownText = signal('');
  protected readonly markdownStreaming = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
  }

  protected streamBasic(): void {
    this.stream(BASIC_REASONING, this.basicText, this.basicStreaming, 30);
  }

  protected streamMarkdown(): void {
    this.stream(MARKDOWN_REASONING, this.markdownText, this.markdownStreaming, 20);
  }

  private stream(
    full: string,
    text: ReturnType<typeof signal<string>>,
    streaming: ReturnType<typeof signal<boolean>>,
    delayMs: number,
  ): void {
    if (!this.isBrowser) return;
    streaming.set(true);
    text.set('');
    const tick = (i: number): void => {
      text.set(full.slice(0, i));
      if (i < full.length) {
        this.timers.push(setTimeout(() => tick(i + 1), delayMs));
      } else {
        streaming.set(false);
      }
    };
    tick(0);
  }

  protected readonly basicCode = `<button hlmBtn variant="outline" size="sm"
        [disabled]="streaming()" (click)="generate()">
  {{ streaming() ? 'Generating...' : 'Generate Reasoning' }}
</button>

<pk-reasoning [isStreaming]="streaming()">
  <pk-reasoning-trigger>Show reasoning</pk-reasoning-trigger>
  <pk-reasoning-content
    contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
    [content]="text()"
  />
</pk-reasoning>`;

  protected readonly markdownCode = `<button hlmBtn variant="outline" size="sm"
        [disabled]="streaming()" (click)="generate()">
  {{ streaming() ? 'Thinking...' : 'Generate Reasoning' }}
</button>

<pk-reasoning [isStreaming]="streaming()">
  <pk-reasoning-trigger>Show AI reasoning</pk-reasoning-trigger>
  <pk-reasoning-content
    contentClass="border-l-border ml-2 border-l-2 px-2 pb-1"
    [markdown]="true"
    [content]="text()"
  />
</pk-reasoning>`;
}
