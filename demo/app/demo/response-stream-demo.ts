import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkResponseStream } from 'ngx-prompt-kit/response-stream';

@Component({
  selector: 'app-response-stream-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, HlmButton, PkResponseStream],
  template: `
    <app-doc-page
      title="Response Stream"
      description="Reveals text chunk-by-chunk to mimic an LLM's streaming response. Two modes: typewriter (cumulative) or fade (per-word)."
    >
      <app-doc-example
        title="Typewriter mode"
        description="One chunk per animation frame. Speed is on a 1–100 scale."
        [code]="twCode"
      >
        <div class="w-full">
          <button hlmBtn variant="outline" size="sm" type="button" class="mb-4" (click)="restart('tw')">
            Restart
          </button>
          <pk-response-stream
            class="text-base leading-relaxed"
            [textStream]="twText()"
            mode="typewriter"
            [speed]="40"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Fade mode"
        description="Each word fades in independently. Feels softer for long-form output."
        [code]="fadeCode"
      >
        <div class="w-full">
          <button hlmBtn variant="outline" size="sm" type="button" class="mb-4" (click)="restart('fade')">
            Restart
          </button>
          <pk-response-stream
            class="text-base leading-relaxed"
            [textStream]="fadeText()"
            mode="fade"
            [speed]="40"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Live streaming (continues, doesn't restart)"
        description="Simulates an LLM streaming response: chunks arrive every ~150ms and append to the bound signal. The typewriter continues from where it left off rather than restarting on every update."
        [code]="liveCode"
      >
        <div class="flex w-full flex-col gap-3">
          <div class="flex gap-2">
            <button
              hlmBtn
              variant="default"
              size="sm"
              type="button"
              [disabled]="streaming()"
              (click)="startStreaming()"
            >
              {{ streaming() ? 'Streaming…' : 'Start streaming' }}
            </button>
            <button
              hlmBtn
              variant="outline"
              size="sm"
              type="button"
              [disabled]="streaming()"
              (click)="resetStreaming()"
            >
              Reset
            </button>
          </div>
          <pk-response-stream
            class="text-base leading-relaxed"
            [textStream]="liveText()"
            mode="typewriter"
            [speed]="60"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Big chunks, slow cadence"
        description="A larger paragraph-sized chunk arrives every 1000ms — closer to a real LLM that streams complete sentences. Same continuation behaviour: typewriter advances through the new content without restarting."
        [code]="bigCode"
      >
        <div class="flex w-full flex-col gap-3">
          <div class="flex gap-2">
            <button
              hlmBtn
              variant="default"
              size="sm"
              type="button"
              [disabled]="bigStreaming()"
              (click)="startBigStreaming()"
            >
              {{ bigStreaming() ? 'Streaming…' : 'Start streaming' }}
            </button>
            <button
              hlmBtn
              variant="outline"
              size="sm"
              type="button"
              [disabled]="bigStreaming()"
              (click)="resetBigStreaming()"
            >
              Reset
            </button>
          </div>
          <pk-response-stream
            class="text-base leading-relaxed"
            [textStream]="bigText()"
            mode="typewriter"
            [speed]="80"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Adaptive pacing + finished handshake"
        description="adaptive scales the reveal speed with the backlog: it types character-by-character while caught up with the stream and accelerates when chunks arrive faster than the reveal. Set done when the source stream ends and the component emits finished exactly once after the last character is revealed — the moment to swap in your final rendering (e.g. markdown) without cutting the animation short."
        [code]="adaptiveCode"
      >
        <div class="flex w-full flex-col gap-3">
          <div class="flex gap-2">
            <button
              hlmBtn
              variant="default"
              size="sm"
              type="button"
              [disabled]="adaptiveStreaming()"
              (click)="startAdaptive()"
            >
              {{ adaptiveStreaming() ? 'Streaming…' : 'Start streaming' }}
            </button>
            <button
              hlmBtn
              variant="outline"
              size="sm"
              type="button"
              [disabled]="adaptiveStreaming()"
              (click)="resetAdaptive()"
            >
              Reset
            </button>
          </div>
          @if (adaptiveFinished()) {
            <p class="text-base leading-relaxed">{{ adaptiveText() }}</p>
            <p class="text-muted-foreground text-sm">finished fired — swapped to the final static rendering.</p>
          } @else {
            <pk-response-stream
              class="text-base leading-relaxed"
              [textStream]="adaptiveText()"
              [adaptive]="true"
              [done]="adaptiveDone()"
              (finished)="adaptiveFinished.set(true)"
            />
          }
        </div>
      </app-doc-example>

      <app-doc-install component="response-stream" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ResponseStreamDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkResponseStream',
      props: [
        { name: 'textStream', type: 'string', default: "''", description: 'The full text to reveal incrementally.' },
        { name: 'mode', type: '"typewriter" | "fade"', default: '"typewriter"', description: 'Reveal style.' },
        { name: 'speed', type: 'number', default: '20', description: '1–100. Higher = faster.' },
        {
          name: 'adaptive',
          type: 'boolean',
          default: 'false',
          description:
            'Scale reveal speed with the backlog: types character-by-character while caught up, accelerates when the stream outpaces the reveal, never dumps.',
        },
        {
          name: 'done',
          type: 'boolean',
          default: 'false',
          description: 'Tell the component the source stream has ended. Enables the finished output.',
        },
        { name: 'fadeDuration', type: 'number', description: 'Override per-segment fade duration in ms.' },
        { name: 'segmentDelay', type: 'number', description: 'Override per-segment delay in ms.' },
        { name: 'characterChunkSize', type: 'number', description: 'Override characters revealed per frame.' },
        {
          name: 'completed',
          type: 'output<void>',
          description: 'Fires each time the reveal catches up with the current textStream value.',
        },
        {
          name: 'finished',
          type: 'output<void>',
          description: 'Fires exactly once when done is true and every received character has been revealed.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];

  private readonly canned =
    'A response stream lets you reveal generated text incrementally. The component takes a string, a mode, and a speed; it handles the rendering frames for you.';
  protected readonly twText = signal(this.canned);
  protected readonly fadeText = signal(this.canned);
  protected readonly liveText = signal('');
  protected readonly streaming = signal(false);
  protected readonly bigText = signal('');
  protected readonly bigStreaming = signal(false);
  protected readonly adaptiveText = signal('');
  protected readonly adaptiveStreaming = signal(false);
  protected readonly adaptiveDone = signal(false);
  protected readonly adaptiveFinished = signal(false);

  private readonly liveChunks = [
    'Streaming responses ',
    'arrive in pieces ',
    'over the network. ',
    'Each chunk extends ',
    'the previous content, ',
    'so the renderer should ',
    'continue typing — ',
    'not restart from the top.',
  ];

  private readonly bigChunks = [
    'When a model streams a long answer, the chunks tend to be paragraph-sized rather than per-token. ',
    'Each chunk arrives as a single update to the bound signal, but the typewriter should keep advancing through the new tail without flashing back to the start. ',
    'This example pushes a fresh paragraph every second so you can watch the renderer absorb the new tail and keep typing through it. ',
    'After the third chunk lands, the animation reaches the end of the message and emits (completed). The component then stays idle, ready for more if it arrives.',
  ];

  protected restart(which: 'tw' | 'fade'): void {
    const target = which === 'tw' ? this.twText : this.fadeText;
    target.set('');
    setTimeout(() => target.set(this.canned), 50);
  }

  protected resetStreaming(): void {
    this.liveText.set('');
  }

  protected startStreaming(): void {
    this.liveText.set('');
    this.streaming.set(true);
    let i = 0;
    const tick = (): void => {
      if (i >= this.liveChunks.length) {
        this.streaming.set(false);
        return;
      }
      this.liveText.update((v) => v + this.liveChunks[i]);
      i++;
      setTimeout(tick, 150);
    };
    setTimeout(tick, 150);
  }

  protected resetBigStreaming(): void {
    this.bigText.set('');
  }

  protected startBigStreaming(): void {
    this.bigText.set('');
    this.bigStreaming.set(true);
    let i = 0;
    const tick = (): void => {
      if (i >= this.bigChunks.length) {
        this.bigStreaming.set(false);
        return;
      }
      this.bigText.update((v) => v + this.bigChunks[i]);
      i++;
      setTimeout(tick, 1000);
    };
    setTimeout(tick, 1000);
  }

  protected resetAdaptive(): void {
    this.adaptiveText.set('');
    this.adaptiveDone.set(false);
    this.adaptiveFinished.set(false);
  }

  protected startAdaptive(): void {
    this.resetAdaptive();
    this.adaptiveStreaming.set(true);
    let i = 0;
    const tick = (): void => {
      if (i >= this.bigChunks.length) {
        this.adaptiveStreaming.set(false);
        this.adaptiveDone.set(true);
        return;
      }
      this.adaptiveText.update((v) => v + this.bigChunks[i]);
      i++;
      setTimeout(tick, 400);
    };
    setTimeout(tick, 400);
  }

  protected readonly twCode = `<pk-response-stream
  [textStream]="text"
  mode="typewriter"
  [speed]="40"
/>`;

  protected readonly fadeCode = `<pk-response-stream
  [textStream]="text"
  mode="fade"
  [speed]="40"
/>`;

  protected readonly liveCode = `// Consumer signal updated as chunks arrive
const text = signal('');

function appendChunk(chunk: string) {
  text.update(v => v + chunk);
}

// Template
<pk-response-stream
  [textStream]="text()"
  mode="typewriter"
  [speed]="60"
/>`;

  protected readonly bigCode = `// Paragraph-sized chunk every 1000ms
const text = signal('');

function appendParagraph(chunk: string) {
  text.update(v => v + chunk);
}

// Template — higher speed keeps the catch-up visible at 1s pacing
<pk-response-stream
  [textStream]="text()"
  mode="typewriter"
  [speed]="80"
/>`;

  protected readonly adaptiveCode = `// Consumer accumulates chunks and flags the end of the stream
const text = signal('');
const done = signal(false);
const finished = signal(false);

// On each SSE/WebSocket chunk: text.update(v => v + chunk)
// When the stream ends:        done.set(true)

// Template — swap to the final rendering once \`finished\` fires
@if (finished()) {
  <div [innerHTML]="renderedMarkdown()"></div>
} @else {
  <pk-response-stream
    [textStream]="text()"
    [adaptive]="true"
    [done]="done()"
    (finished)="finished.set(true)"
  />
}`;
}
