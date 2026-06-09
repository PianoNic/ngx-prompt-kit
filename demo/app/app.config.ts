import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/**
 * Platform-neutral providers used by both browser bootstrap and SSR/prerender.
 * Browser-only providers (e.g. `provideBrowserGlobalErrorListeners`) live in
 * `main.ts` so they don't run during route extraction on the server.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
  ],
};
