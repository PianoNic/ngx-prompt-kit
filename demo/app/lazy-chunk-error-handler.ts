import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { NavigationError } from '@angular/router';

/** Matches the various browser messages for a failed dynamic import / chunk fetch. */
function isChunkLoadError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : String(error);
  return /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
    message,
  );
}

const RELOAD_KEY = 'ngx-prompt-kit-chunk-reload';

/**
 * Navigation error handler for `withNavigationErrorHandler`.
 *
 * When a lazy route's chunk fails to load — typically a client holding a stale
 * index.html after a redeploy, which requests chunk filenames whose content
 * hashes no longer exist — force one full reload so the fresh index and chunks
 * are fetched. Without this the router outlet stays empty (a whitescreen).
 *
 * Loop-guarded: a repeat failure within 10s (e.g. a genuinely broken deploy)
 * is left to surface rather than reloading forever.
 */
export function reloadOnChunkLoadError(event: NavigationError): void {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
  if (!isChunkLoadError(event.error)) return;

  const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  if (Date.now() - last < 10_000) return;

  sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  location.reload();
}
