import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Angular 21 SSR/prerender requires the BootstrapContext supplied by the
 * runtime to be threaded into bootstrapApplication. Without it the server
 * platform isn't initialised and route extraction fails with NG0401.
 */
const bootstrap = (context: BootstrapContext): Promise<unknown> =>
  bootstrapApplication(App, config, context);

export default bootstrap;
