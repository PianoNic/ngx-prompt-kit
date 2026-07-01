// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { computed, signal, type Signal } from '@angular/core';

/** Signal-based controller that coordinates a streamed message with the
 *  pk-response-stream reveal animation. */
export interface StreamingMessageController {
  /** Accumulated text — bind to pk-response-stream's [textStream]. */
  readonly text: Signal<string>;
  /** Source stream finished — bind to pk-response-stream's [done]. */
  readonly done: Signal<boolean>;
  /** True while a message is streaming or still revealing; use it to decide
   *  whether to render the streaming bubble at all. */
  readonly streaming: Signal<boolean>;
  /** Append a streamed token to the buffer. */
  append(chunk: string): void;
  /**
   * Mark the source stream complete. pk-response-stream keeps revealing any
   * buffered text and emits (finished) when caught up; pass the work to run at
   * that point (e.g. swap in the final message). If nothing is buffered there
   * is no reveal to wait for, so `onCommit` runs immediately.
   */
  end(onCommit?: () => void): void;
  /** Wire to pk-response-stream's (finished): runs the pending commit and clears. */
  finished(): void;
  /** Hard reset, e.g. on error or before a new message. */
  reset(): void;
}

/**
 * Encapsulates the buffer + done + (finished)→commit handshake every consumer
 * of pk-response-stream re-derives by hand. The message-list mutation stays in
 * your store — this only owns the streaming/reveal coordination.
 *
 * ```ts
 * const stream = createStreamingMessage();
 * // on each token:        stream.append(token)
 * // when the stream ends: stream.end(() => commitFinalMessage())
 * // template: <pk-response-stream [textStream]="stream.text()"
 * //              [done]="stream.done()" (finished)="stream.finished()" />
 * ```
 */
export function createStreamingMessage(): StreamingMessageController {
  const text = signal('');
  const done = signal(false);
  let pendingCommit: (() => void) | null = null;
  // Set once the source stream is done. Blocks late/duplicate tokens (e.g. a
  // provider that re-emits after signalling completion) from re-growing the
  // buffer and making the reveal appear to start over.
  let ended = false;

  const finish = (): void => {
    const commit = pendingCommit;
    pendingCommit = null;
    text.set('');
    done.set(false);
    commit?.();
  };

  return {
    text: text.asReadonly(),
    done: done.asReadonly(),
    streaming: computed(() => text().length > 0 || done()),
    append: (chunk: string) => {
      if (ended) return;
      text.update((current) => current + chunk);
    },
    end: (onCommit?: () => void) => {
      ended = true;
      pendingCommit = onCommit ?? null;
      if (text() === '') {
        // No buffered text → pk-response-stream won't emit (finished).
        finish();
      } else {
        done.set(true);
      }
    },
    finished: finish,
    reset: () => {
      ended = false;
      text.set('');
      done.set(false);
      pendingCommit = null;
    },
  };
}
