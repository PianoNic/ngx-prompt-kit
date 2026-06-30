// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { HttpErrorResponse } from '@angular/common/http';

/** Per-status overrides for {@link describeHttpError}. Any omitted key falls
 *  back to the built-in default. */
export interface HttpErrorMessages {
  /** status 0 — no response (offline, CORS, DNS). */
  network?: string;
  /** status 401 — unauthenticated / session expired. */
  unauthorized?: string;
  /** status 402 or 403 — payment required / forbidden. */
  forbidden?: string;
  /** status 429 — rate limited. */
  rateLimited?: string;
  /** status >= 500 — server error. */
  server?: string;
  /** anything else, including non-HTTP errors with no message. */
  fallback?: string;
}

const DEFAULTS: Required<HttpErrorMessages> = {
  network: 'Network error. Check your connection and try again.',
  unauthorized: 'Your session expired. Sign in again to continue.',
  forbidden: 'Out of credits or not authorized for this action.',
  rateLimited: 'Rate limited. Please wait a moment and retry.',
  server: 'The server hit an error. Try again in a moment.',
  fallback: 'Something went wrong.',
};

/**
 * Map any thrown value to a friendly, user-facing message. Handles Angular's
 * `HttpErrorResponse` by status, falling back to RFC 7807 problem-details
 * (`detail`/`title`) then the raw message. Pass `overrides` to customise the
 * copy per status without rewriting the branching.
 *
 * ```ts
 * catch (err) {
 *   this.error.set(describeHttpError(err, { forbidden: 'Upgrade to use this model.' }));
 * }
 * ```
 */
export function describeHttpError(error: unknown, overrides?: HttpErrorMessages): string {
  const messages = { ...DEFAULTS, ...overrides };

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return messages.network;
    if (error.status === 401) return messages.unauthorized;
    if (error.status === 402 || error.status === 403) return messages.forbidden;
    if (error.status === 429) return messages.rateLimited;
    if (error.status >= 500) return messages.server;
    const detail = (error.error as { detail?: string; title?: string } | null) ?? null;
    return detail?.detail ?? detail?.title ?? error.message ?? messages.fallback;
  }

  return error instanceof Error ? error.message : messages.fallback;
}
