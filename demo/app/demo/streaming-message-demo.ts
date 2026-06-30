import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { PkResponseStream } from 'ngx-prompt-kit/response-stream';
import { createStreamingMessage } from 'ngx-prompt-kit/streaming-message';

const TOKENS = ['Hello', ', ', 'this ', 'is ', 'a ', 'streamed ', 'reply.'];

@Component({
  selector: 'app-streaming-message-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, HlmButton, PkResponseStream, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Streaming Message"
      [original]="true"
      description="createStreamingMessage() coordinates the pk-response-stream reveal handshake: accumulate tokens, mark the source stream done, and commit the final message only once the reveal animation catches up. Your store keeps the message-list mutation."
    >
      <app-doc-example
        title="Simulated streamed reply"
        description="Click to stream tokens into pk-response-stream via the controller. When the source 'stream' ends the bubble keeps revealing; on (finished) the controller runs the commit callback, which appends the final message and clears the live bubble."
        [code]="usageCode"
      >
        <div class="flex w-full max-w-xl flex-col gap-3">
          <div class="flex flex-col gap-3" data-testid="sm-thread">
            @for (msg of committed(); track $index) {
              <div class="bg-muted/40 rounded-md border p-3 text-sm" data-testid="committed-msg">
                {{ msg }}
              </div>
            }
            @if (stream.streaming()) {
              <div class="rounded-md border p-3 text-sm" data-testid="streaming-bubble">
                <pk-response-stream
                  [textStream]="stream.text()"
                  [done]="stream.done()"
                  [speed]="35"
                  [adaptive]="true"
                  (finished)="stream.finished()"
                />
              </div>
            }
          </div>
          <div>
            <button
              hlmBtn
              size="sm"
              type="button"
              data-testid="sm-start"
              [disabled]="running()"
              (click)="simulate()"
            >
              Simulate streamed reply
            </button>
          </div>
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Add the streaming-message helper to your project.
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
export class StreamingMessageDemo {
  protected readonly stream = createStreamingMessage();
  protected readonly committed = signal<string[]>([]);
  protected readonly running = signal(false);

  protected simulate(): void {
    if (this.running()) return;
    this.running.set(true);
    this.stream.reset();
    let full = '';
    let i = 0;
    const step = (): void => {
      if (i < TOKENS.length) {
        const token = TOKENS[i++];
        full += token;
        this.stream.append(token);
        setTimeout(step, 100);
      } else {
        this.stream.end(() => {
          this.committed.update((messages) => [...messages, full]);
          this.running.set(false);
        });
      }
    };
    step();
  }

  protected readonly installCmd = 'ng generate ngx-prompt-kit:streaming-message';

  protected readonly usageCode = `import { createStreamingMessage } from 'ngx-prompt-kit/streaming-message';

readonly stream = createStreamingMessage();

// on each token from your SSE handler:
this.stream.append(token);

// when the source stream ends:
this.stream.end(() => this.commitFinalMessage());

// template:
// <pk-response-stream [textStream]="stream.text()" [done]="stream.done()"
//   [adaptive]="true" (finished)="stream.finished()" />`;
}
