import { type HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type Observable, of } from 'rxjs';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { readChatStream, type ChatStreamFrame } from 'ngx-prompt-kit/streaming';

const SSE = [
  'data: {"type":"chunk","text":"The answer "}',
  '',
  'data: {"type":"tool_call","name":"calc","input":"6 * 7"}',
  '',
  'data: {"type":"tool_result","name":"calc","output":"42"}',
  '',
  'data: {"type":"chunk","text":"is 42."}',
  '',
  'data: {"type":"done","result":"ok"}',
  '',
  '',
].join('\n');

interface Payload {
  type: string;
  text?: string;
  name?: string;
  input?: string;
  output?: string;
  result?: string;
  error?: string;
}

function adapt(data: string): ChatStreamFrame<string> | null {
  const p = JSON.parse(data) as Payload;
  switch (p.type) {
    case 'chunk':
      return { kind: 'token', text: p.text };
    case 'tool_call':
      return { kind: 'tool-call', name: p.name, input: p.input };
    case 'tool_result':
      return { kind: 'tool-result', name: p.name, output: p.output };
    case 'done':
      return { kind: 'done', result: p.result };
    case 'error':
      return { kind: 'error', error: p.error };
    default:
      return null;
  }
}

@Component({
  selector: 'app-chat-stream-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Chat Stream"
      [original]="true"
      description="readChatStream() reduces an SSE chat stream — tokens, tool calls/results, done/error — into handler callbacks and resolves with the terminal result. You supply an adapt() from your backend's payload shape, so it works over any tool-calling backend."
    >
      <app-doc-example
        title="Reduce a stream"
        description="Runs readChatStream() over a simulated HttpClient event stream: tokens accumulate, tool calls/results are recorded, and the done payload resolves the promise."
        [code]="usageCode"
      >
        <div class="flex w-full max-w-xl flex-col gap-3">
          <button
            class="border-border hover:bg-accent w-fit rounded-md border px-3 py-1.5 text-sm"
            type="button"
            data-testid="cs-run"
            (click)="run()"
          >
            Run stream
          </button>
          @if (ran()) {
            <div class="flex flex-col gap-2 text-sm">
              <div data-testid="cs-text">
                <span class="text-muted-foreground">tokens:</span> {{ text() }}
              </div>
              <div data-testid="cs-tools">
                <span class="text-muted-foreground">tools:</span> {{ tools().join(', ') }}
              </div>
              <div data-testid="cs-result">
                <span class="text-muted-foreground">result:</span> {{ result() }}
              </div>
            </div>
          }
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          readChatStream() ships with the streaming utility.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="installCmd" language="bash" />
          </pk-code-block>
        </div>
      </section>
    </app-doc-page>
  `,
})
export class ChatStreamDemo {
  protected readonly text = signal('');
  protected readonly tools = signal<string[]>([]);
  protected readonly result = signal<string | null>(null);
  protected readonly ran = signal(false);

  protected async run(): Promise<void> {
    this.text.set('');
    this.tools.set([]);
    this.result.set(null);
    this.ran.set(true);

    const mid = SSE.indexOf('tool_result');
    const events$ = of(
      { type: HttpEventType.DownloadProgress, partialText: SSE.slice(0, mid) },
      { type: HttpEventType.DownloadProgress, partialText: SSE },
      { type: HttpEventType.Response, body: SSE },
    ) as unknown as Observable<HttpEvent<unknown>>;

    const res = await readChatStream<string>(events$, adapt, {
      onToken: (t) => this.text.update((s) => s + t),
      onToolCall: (name, input) => this.tools.update((l) => [...l, `${name}(${input})`]),
      onToolResult: (name, output) => this.tools.update((l) => [...l, `${name}→${output}`]),
    });
    this.result.set(res);
  }

  protected readonly installCmd = 'ng generate ngx-prompt-kit:streaming';

  protected readonly usageCode = `import { readChatStream } from 'ngx-prompt-kit/streaming';

const result = await readChatStream(events$, (data) => {
  const p = JSON.parse(data);
  if (p.type === 'chunk') return { kind: 'token', text: p.text };
  if (p.type === 'done')  return { kind: 'done', result: p.result };
  return null;
}, { onToken: (t) => stream.append(t) });`;
}
