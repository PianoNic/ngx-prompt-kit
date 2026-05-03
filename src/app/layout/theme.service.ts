import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const KEY = 'prompt-kit-ng-theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  public readonly theme = signal<Theme>('light');

  constructor() {
    if (!this.isBrowser) return;
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? this.systemTheme();
    this.apply(stored);
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(t: Theme): void {
    this.theme.set(t);
    if (!this.isBrowser) return;
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem(KEY, t);
  }

  private systemTheme(): Theme {
    return this.isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
