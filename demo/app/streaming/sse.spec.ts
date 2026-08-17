import { HttpEventType, type HttpEvent } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { consumeSseFrames, readSseHttpEvents } from 'ngx-prompt-kit/streaming';

function collect(): { data: string[]; onData: (d: string) => void } {
  const data: string[] = [];
  return { data, onData: (d) => data.push(d) };
}

function progress(partialText: string): HttpEvent<unknown> {
  return { type: HttpEventType.DownloadProgress, loaded: partialText.length, partialText } as never;
}

function response(body: string | null): HttpEvent<unknown> {
  return { type: HttpEventType.Response, body } as never;
}

describe('consumeSseFrames', () => {
  it('emits one payload per complete frame and returns the partial tail', () => {
    const { data, onData } = collect();
    const tail = consumeSseFrames('data: a\n\ndata: b\n\ndata: par', onData);
    expect(data).toEqual(['a', 'b']);
    expect(tail).toBe('data: par');
  });

  it('reassembles a frame split across chunks', () => {
    const { data, onData } = collect();
    const tail = consumeSseFrames('data: hel', onData);
    expect(data).toEqual([]);
    consumeSseFrames(tail + 'lo\n\n', onData);
    expect(data).toEqual(['hello']);
  });

  it('joins multiple data lines within one frame with a newline', () => {
    const { data, onData } = collect();
    consumeSseFrames('data: one\ndata: two\n\n', onData);
    expect(data).toEqual(['one\ntwo']);
  });

  it('strips only a single leading space after the colon', () => {
    const { data, onData } = collect();
    consumeSseFrames('data: spaced\n\ndata:tight\n\ndata:  two\n\n', onData);
    expect(data).toEqual(['spaced', 'tight', ' two']);
  });

  it('ignores frames carrying no data lines', () => {
    const { data, onData } = collect();
    consumeSseFrames(': keep-alive\n\nevent: ping\n\ndata: real\n\n', onData);
    expect(data).toEqual(['real']);
  });

  it('preserves empty data payloads', () => {
    const { data, onData } = collect();
    consumeSseFrames('data:\n\n', onData);
    expect(data).toEqual(['']);
  });
});

describe('readSseHttpEvents', () => {
  it('diffs cumulative partialText so each frame is emitted once', async () => {
    const { data, onData } = collect();
    await readSseHttpEvents(
      of(progress('data: a\n\n'), progress('data: a\n\ndata: b\n\n'), response(null)),
      onData,
    );
    expect(data).toEqual(['a', 'b']);
  });

  it('normalises CRLF frame separators', async () => {
    const { data, onData } = collect();
    await readSseHttpEvents(of(progress('data: a\r\n\r\n'), response(null)), onData);
    expect(data).toEqual(['a']);
  });

  it('consumes frames that only arrive in the final response body', async () => {
    const { data, onData } = collect();
    await readSseHttpEvents(of(response('data: only\n\n')), onData);
    expect(data).toEqual(['only']);
  });

  it('resolves on the response event', async () => {
    const events$ = new Subject<HttpEvent<unknown>>();
    const { onData } = collect();
    const done = readSseHttpEvents(events$, onData);
    events$.next(progress('data: a\n\n'));
    events$.next(response(null));
    await expect(done).resolves.toBeUndefined();
  });

  it('rejects when the http stream errors', async () => {
    const { onData } = collect();
    await expect(
      readSseHttpEvents(
        throwError(() => new Error('socket')),
        onData,
      ),
    ).rejects.toThrow('socket');
  });
});
