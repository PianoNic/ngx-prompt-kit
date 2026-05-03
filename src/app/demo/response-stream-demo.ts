import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkResponseStream } from 'prompt-kit-ng/response-stream';

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
        { name: 'fadeDuration', type: 'number', description: 'Override per-segment fade duration in ms.' },
        { name: 'segmentDelay', type: 'number', description: 'Override per-segment delay in ms.' },
        { name: 'characterChunkSize', type: 'number', description: 'Override characters revealed per frame.' },
        { name: 'completed', type: 'output<void>', description: 'Fires when the stream finishes.' },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];

  private readonly canned =
    'A response stream lets you reveal generated text incrementally. The component takes a string, a mode, and a speed; it handles the rendering frames for you.';
  protected readonly twText = signal(this.canned);
  protected readonly fadeText = signal(this.canned);

  protected restart(which: 'tw' | 'fade'): void {
    const target = which === 'tw' ? this.twText : this.fadeText;
    target.set('');
    setTimeout(() => target.set(this.canned), 50);
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
}
