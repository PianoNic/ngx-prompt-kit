// ngx-prompt-kit original — not part of ibelick/prompt-kit
import type { HttpEvent } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { readSseHttpEvents } from './sse';

/** Normalised chat-stream frame. Your `adapt` maps each raw SSE `data` payload
 *  to one of these (or `null` to ignore it). */
export interface ChatStreamFrame<TResult = unknown> {
  kind: 'token' | 'reasoning' | 'tool-call' | 'tool-result' | 'done' | 'error';
  /** For `token` and `reasoning`: the text delta. */
  text?: string;
  /** For `tool-call` / `tool-result`: the tool name. */
  name?: string;
  /** For `tool-call`: the tool input. */
  input?: string;
  /** For `tool-result`: the tool output. */
  output?: string;
  /** For `done`: the terminal result returned by readChatStream. */
  result?: TResult;
  /** For `error`: the failure message. */
  error?: string;
}

/** Callbacks invoked as the stream is consumed. */
export interface ChatStreamHandlers {
  onToken?(text: string): void;
  /** A reasoning/thinking delta (separate from the answer text). */
  onReasoning?(text: string): void;
  onToolCall?(name: string, input: string): void;
  onToolResult?(name: string, output: string): void;
}

/**
 * Consume an SSE chat stream and reduce it to handler callbacks, resolving with
 * the terminal `done` result. Builds on {@link readSseHttpEvents}; you supply an
 * `adapt` that maps each raw SSE `data` string to a {@link ChatStreamFrame}, so
 * the helper stays independent of your backend's payload shape/discriminator.
 *
 * Rejects if the stream emits an `error` frame or ends without a `done`.
 *
 * ```ts
 * const result = await readChatStream<SendResult>(events$, (data) => {
 *   const p = JSON.parse(data) as MyPayload;
 *   if (p.type === 'chunk')  return { kind: 'token', text: p.text };
 *   if (p.type === 'done')   return { kind: 'done', result: p.result };
 *   return null;
 * }, { onToken: (t) => this.stream.append(t) });
 * ```
 */
export function readChatStream<TResult>(
  events$: Observable<HttpEvent<unknown>>,
  adapt: (data: string) => ChatStreamFrame<TResult> | null,
  handlers: ChatStreamHandlers = {},
): Promise<TResult> {
  let result: TResult | undefined;
  let failed: string | undefined;
  let gotResult = false;

  return readSseHttpEvents(events$, (data) => {
    const frame = adapt(data);
    if (!frame) return;
    switch (frame.kind) {
      case 'token':
        if (frame.text) handlers.onToken?.(frame.text);
        break;
      case 'reasoning':
        if (frame.text) handlers.onReasoning?.(frame.text);
        break;
      case 'tool-call':
        if (frame.name) handlers.onToolCall?.(frame.name, frame.input ?? '');
        break;
      case 'tool-result':
        if (frame.name) handlers.onToolResult?.(frame.name, frame.output ?? '');
        break;
      case 'done':
        result = frame.result;
        gotResult = true;
        break;
      case 'error':
        failed = frame.error ?? 'The stream failed.';
        break;
    }
  }).then(() => {
    if (failed !== undefined) throw new Error(failed);
    if (!gotResult) throw new Error('The stream ended unexpectedly.');
    return result as TResult;
  });
}
