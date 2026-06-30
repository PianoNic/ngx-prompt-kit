// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  type HttpDownloadProgressEvent,
  type HttpEvent,
  HttpEventType,
  type HttpResponse,
} from '@angular/common/http';
import type { Observable } from 'rxjs';

/**
 * Split `\n\n`-delimited Server-Sent-Event frames out of a growing `buffer`,
 * invoking `onData` once per complete frame with its concatenated `data:` lines.
 *
 * Returns the unconsumed tail (a partial frame) so it can be prepended to the
 * next chunk. This is a pure function — no I/O, no transport assumptions — so it
 * works for `fetch` ReadableStreams, WebSockets, or the Angular helper below.
 */
export function consumeSseFrames(buffer: string, onData: (data: string) => void): string {
  let separator = buffer.indexOf('\n\n');
  while (separator !== -1) {
    const frame = buffer.slice(0, separator);
    buffer = buffer.slice(separator + 2);
    const dataLines: string[] = [];
    for (const line of frame.split('\n')) {
      if (line.startsWith('data:')) {
        // Per the SSE spec a single leading space after the colon is stripped.
        dataLines.push(line.slice(line.startsWith('data: ') ? 'data: '.length : 'data:'.length));
      }
    }
    if (dataLines.length > 0) {
      onData(dataLines.join('\n'));
    }
    separator = buffer.indexOf('\n\n');
  }
  return buffer;
}

/**
 * Consume an Angular `HttpClient` event stream as Server-Sent Events.
 *
 * Request the stream with `observe: 'events'`, `reportProgress: true` and a text
 * (or text-typed) response so each `DownloadProgress` event carries the
 * **cumulative** raw body in `partialText`. This helper diffs each cumulative
 * snapshot, buffers complete frames, and calls `onData` for every frame's data
 * payload as it arrives. The returned promise resolves once the final response
 * event is delivered, and rejects if the HTTP stream errors.
 *
 * The caller owns interpretation of each frame (e.g. `JSON.parse` + a switch on
 * a discriminator) and any notion of a terminal "result" or "error" payload.
 */
export function readSseHttpEvents(
  events$: Observable<HttpEvent<unknown>>,
  onData: (data: string) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let parsedUpTo = 0;
    let buffer = '';

    const ingest = (cumulativeText: string): void => {
      // `partialText` is cumulative; only the newly-arrived slice is unparsed.
      buffer += cumulativeText.slice(parsedUpTo).replace(/\r\n/g, '\n');
      parsedUpTo = cumulativeText.length;
      buffer = consumeSseFrames(buffer, onData);
    };

    events$.subscribe({
      next: (event) => {
        if (event.type === HttpEventType.DownloadProgress) {
          ingest((event as HttpDownloadProgressEvent).partialText ?? '');
        } else if (event.type === HttpEventType.Response) {
          ingest(((event as HttpResponse<unknown>).body as string | null) ?? '');
          resolve();
        }
      },
      error: (err) => reject(err),
    });
  });
}
