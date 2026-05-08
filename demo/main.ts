import {
  mergeApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

const browserConfig = mergeApplicationConfig(appConfig, {
  providers: [provideBrowserGlobalErrorListeners()],
});

bootstrapApplication(App, browserConfig).catch((err) => console.error(err));
