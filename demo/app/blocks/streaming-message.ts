import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkResponseStream } from 'ngx-prompt-kit/response-stream';
import {
  PkStreamControlsImports,
  type StreamControlsState,
} from 'ngx-prompt-kit/stream-controls';

const FULL_RESPONSE = `Sure — here's a small \`computed()\` example.

\`\`\`ts
import { signal, computed } from '@angular/core';

const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(3);
console.log(doubled()); // 6
\`\`\`

The key idea: **\`computed()\` re-evaluates lazily** and only when one of its dependencies actually changes. Reading \`doubled()\` twice in a row hits a cached value.

Want me to show \`effect()\` next?`;

@Component({
  selector: 'app-block-streaming-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkMessageImports, PkResponseStream, PkStreamControlsImports],
  template: `
    <app-block-page
      title="Streaming assistant message"
      description="A real assistant turn: user prompt above, the response streams in chunks with markdown + a fenced code block, and stream-controls swap from Stop to Regenerate when it finishes."
    >
      <app-doc-example title="Live response with stream controls" [code]="code">
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Show me a small computed() example."
            />
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <div class="flex min-w-0 flex-1 flex-col gap-2">
              @if (state() === 'streaming' || streamed()) {
                <pk-response-stream
                  class="prose prose-sm dark:prose-invert min-w-0 max-w-none"
                  [textStream]="streamed()"
                  [markdown]="true"
                  [speed]="80"
                />
              }
            </div>
          </pk-message>

          <div class="ml-11 flex">
            <pk-stream-controls
              [state]="state()"
              (stop)="stop()"
              (regenerate)="start()"
            />
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class StreamingMessageBlock {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected readonly state = signal<StreamControlsState>('idle');
  protected readonly streamed = signal('');

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
    if (this.isBrowser) {
      this.timer = setTimeout(() => this.start(), 200);
    }
  }

  protected start(): void {
    if (!this.isBrowser) return;
    this.streamed.set('');
    this.state.set('streaming');
    const chunks = FULL_RESPONSE.match(/.{1,40}/gs) ?? [];
    let i = 0;
    const tick = (): void => {
      if (this.state() !== 'streaming') return;
      if (i >= chunks.length) {
        this.state.set('idle');
        return;
      }
      this.streamed.update((v) => v + chunks[i]);
      i++;
      this.timer = setTimeout(tick, 120);
    };
    this.timer = setTimeout(tick, 120);
  }

  protected stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.state.set('idle');
  }

  protected readonly code = `<pk-message class="justify-end">
  <pk-message-content
    class="bg-primary text-primary-foreground"
    content="Show me a small computed() example."
  />
</pk-message>

<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-response-stream
    class="prose prose-sm dark:prose-invert max-w-none"
    [textStream]="streamed()"
    [markdown]="true"
    [speed]="80"
  />
</pk-message>

<pk-stream-controls
  [state]="state()"
  (stop)="stop()"
  (regenerate)="start()"
/>

// Component — chunked append while streaming.
// pk-markdown re-renders on each update; partial markdown still renders gracefully.
protected readonly state = signal<StreamControlsState>('idle');
protected readonly streamed = signal('');

protected start(): void {
  this.streamed.set('');
  this.state.set('streaming');
  const chunks = FULL_RESPONSE.match(/.{1,40}/gs) ?? [];
  let i = 0;
  const tick = () => {
    if (this.state() !== 'streaming') return;
    if (i >= chunks.length) { this.state.set('idle'); return; }
    this.streamed.update(v => v + chunks[i++]);
    setTimeout(tick, 120);
  };
  setTimeout(tick, 120);
}

protected stop(): void { this.state.set('idle'); }`;
}
