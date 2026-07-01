import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
} from '@angular/router';

import { routes } from './app.routes';
import { reloadOnChunkLoadError } from './lazy-chunk-error-handler';

/**
 * Platform-neutral providers used by both browser bootstrap and SSR/prerender.
 * Browser-only providers (e.g. `provideBrowserGlobalErrorListeners`) live in
 * `main.ts` so they don't run during route extraction on the server.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withNavigationErrorHandler(reloadOnChunkLoadError),
    ),
  ],
};
