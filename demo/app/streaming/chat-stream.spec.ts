import { HttpEventType, type HttpEvent } from '@angular/common/http';
import { of, type Observable } from 'rxjs';
import { readChatStream, type ChatStreamFrame } from 'ngx-prompt-kit/streaming';

/** One SSE frame per payload, delivered as a single cumulative response body. */
function stream(...payloads: string[]): Observable<HttpEvent<unknown>> {
  const body = payloads.map((p) => `data: ${p}\n\n`).join('');
  return of({ type: HttpEventType.Response, body } as unknown as HttpEvent<unknown>);
}

const adapt = (data: string): ChatStreamFrame<{ id: string }> | null =>
  JSON.parse(data) as ChatStreamFrame<{ id: string }>;

describe('readChatStream', () => {
  it('resolves with the done frame result', async () => {
    const result = await readChatStream(
      stream(JSON.stringify({ kind: 'done', result: { id: 'r1' } })),
      adapt,
    );
    expect(result).toEqual({ id: 'r1' });
  });

  it('routes token and reasoning deltas to separate handlers', async () => {
    const tokens: string[] = [];
    const reasoning: string[] = [];
    await readChatStream(
      stream(
        JSON.stringify({ kind: 'reasoning', text: 'thinking' }),
        JSON.stringify({ kind: 'token', text: 'hel' }),
        JSON.stringify({ kind: 'token', text: 'lo' }),
        JSON.stringify({ kind: 'done', result: { id: 'r1' } }),
      ),
      adapt,
      { onToken: (t) => tokens.push(t), onReasoning: (t) => reasoning.push(t) },
    );
    expect(tokens).toEqual(['hel', 'lo']);
    expect(reasoning).toEqual(['thinking']);
  });

  it('passes tool calls and results through with defaulted payloads', async () => {
    const calls: string[] = [];
    await readChatStream(
      stream(
        JSON.stringify({ kind: 'tool-call', name: 'search', input: 'q' }),
        JSON.stringify({ kind: 'tool-call', name: 'noInput' }),
        JSON.stringify({ kind: 'tool-result', name: 'search', output: 'hit' }),
        JSON.stringify({ kind: 'done', result: { id: 'r1' } }),
      ),
      adapt,
      {
        onToolCall: (n, i) => calls.push(`call:${n}(${i})`),
        onToolResult: (n, o) => calls.push(`result:${n}(${o})`),
      },
    );
    expect(calls).toEqual(['call:search(q)', 'call:noInput()', 'result:search(hit)']);
  });

  it('ignores frames the adapter maps to null', async () => {
    const tokens: string[] = [];
    await readChatStream(
      stream(JSON.stringify({ kind: 'noise' }), JSON.stringify({ kind: 'done', result: null })),
      (data) => {
        const p = JSON.parse(data) as { kind: string; result?: null };
        return p.kind === 'noise' ? null : (p as ChatStreamFrame<null>);
      },
      { onToken: (t) => tokens.push(t) },
    );
    expect(tokens).toEqual([]);
  });

  it('rejects with the error frame message', async () => {
    await expect(
      readChatStream(stream(JSON.stringify({ kind: 'error', error: 'rate limited' })), adapt),
    ).rejects.toThrow('rate limited');
  });

  it('rejects with a default message when an error frame carries none', async () => {
    await expect(readChatStream(stream(JSON.stringify({ kind: 'error' })), adapt)).rejects.toThrow(
      'The stream failed.',
    );
  });

  it('rejects when the stream ends without a done frame', async () => {
    await expect(
      readChatStream(stream(JSON.stringify({ kind: 'token', text: 'hi' })), adapt),
    ).rejects.toThrow('The stream ended unexpectedly.');
  });

  it('prefers the error over a done frame that also arrived', async () => {
    await expect(
      readChatStream(
        stream(
          JSON.stringify({ kind: 'done', result: { id: 'r1' } }),
          JSON.stringify({ kind: 'error', error: 'truncated' }),
        ),
        adapt,
      ),
    ).rejects.toThrow('truncated');
  });
});
