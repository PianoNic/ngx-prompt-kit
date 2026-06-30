import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { consumeSseFrames } from 'ngx-prompt-kit/streaming';

const SAMPLE_SSE = [
  'data: {"type":"chunk","text":"Hello"}',
  '',
  'data: {"type":"chunk","text":", world"}',
  '',
  'data: {"type":"tool_call","name":"search"}',
  '',
  'data: {"type":"done"}',
  '',
  '',
].join('\n');

@Component({
  selector: 'app-streaming-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, HlmButton, HlmTextarea, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Streaming (SSE)"
      [original]="true"
      description="Transport helpers for consuming Server-Sent-Event chat streams. consumeSseFrames() is a pure frame splitter; readSseHttpEvents() adapts an Angular HttpClient event stream into per-frame callbacks. The caller owns interpreting each frame."
    >
      <app-doc-example
        title="Frame parser playground"
        description="consumeSseFrames() splits a raw SSE body into the data payload of each complete frame, returning any partial tail. Paste raw frames below and parse them."
        [code]="parserCode"
      >
        <div class="flex w-full flex-col gap-3">
          <textarea
            hlmTextarea
            class="min-h-32 w-full font-mono text-xs"
            data-testid="sse-input"
            [value]="raw()"
            (input)="raw.set($any($event.target).value)"
          ></textarea>
          <div>
            <button hlmBtn size="sm" type="button" data-testid="sse-parse" (click)="parse()">
              Parse frames
            </button>
          </div>
          @if (parsed()) {
            <div class="flex flex-col gap-2" data-testid="sse-frames">
              <p class="text-muted-foreground text-xs">
                Parsed <span data-testid="sse-frame-count">{{ frames().length }}</span> frame(s):
              </p>
              @for (frame of frames(); track $index) {
                <pk-code-block>
                  <pk-code-block-code [code]="frame" language="json" />
                </pk-code-block>
              }
            </div>
          }
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Add the SSE streaming helpers to your project.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="installCmd" language="bash" />
          </pk-code-block>
        </div>
      </section>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">HTTP usage</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          readSseHttpEvents() handles the cumulative partialText / frame buffering; your callback
          parses each frame and decides what is a result or an error.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="httpCode" language="typescript" />
          </pk-code-block>
        </div>
      </section>
    </app-doc-page>
  `,
})
export class StreamingDemo {
  protected readonly raw = signal(SAMPLE_SSE);
  protected readonly frames = signal<string[]>([]);
  protected readonly parsed = signal(false);

  protected parse(): void {
    const out: string[] = [];
    consumeSseFrames(this.raw().replace(/\r\n/g, '\n'), (data) => out.push(data));
    this.frames.set(out);
    this.parsed.set(true);
  }

  protected readonly installCmd = 'ng generate ngx-prompt-kit:streaming';

  protected readonly parserCode = `import { consumeSseFrames } from 'ngx-prompt-kit/streaming';

const frames: string[] = [];
const tail = consumeSseFrames(rawBuffer, (data) => frames.push(data));
// \`tail\` is any incomplete trailing frame — prepend it to the next chunk.`;

  protected readonly httpCode = `import { readSseHttpEvents } from 'ngx-prompt-kit/streaming';

let result: SendResult | null = null;
await readSseHttpEvents(
  http.post('/api/chat', body, { observe: 'events', reportProgress: true, responseType: 'text' }),
  (data) => {
    const payload = JSON.parse(data);
    if (payload.type === 'chunk') appendToken(payload.text);
    else if (payload.type === 'done') result = payload.result;
  },
);`;
}
