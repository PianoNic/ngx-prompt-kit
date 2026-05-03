import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { filter } from 'rxjs/operators';
import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, HlmButton, SidebarNav, ThemeToggle],
  template: `
    <div class="bg-background text-foreground min-h-screen">
      <header
        class="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur"
      >
        <button
          hlmBtn
          variant="ghost"
          size="icon-sm"
          type="button"
          aria-label="Open navigation"
          class="md:hidden"
          (click)="toggleMobileNav()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        <a
          routerLink="/"
          class="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="prompt-kit-ng home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            class="text-foreground h-6 w-6"
            aria-hidden="true"
            fill="none"
          >
            <rect width="64" height="64" rx="14" fill="currentColor" />
            <path
              d="M20 14 L44 32 L20 50"
              stroke="var(--background)"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>prompt-kit-ng</span>
        </a>

        <div class="flex-1"></div>
        <app-theme-toggle />
      </header>

      <div class="md:grid md:grid-cols-[16rem_1fr]">
        <aside
          class="border-border sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r md:block"
        >
          <app-sidebar-nav />
        </aside>

        <main class="min-h-[calc(100vh-3.5rem)]">
          <router-outlet />
        </main>
      </div>

      <!-- Mobile drawer -->
      @if (mobileNavOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/40 md:hidden"
          (click)="closeMobileNav()"
          aria-hidden="true"
        ></div>
        <div
          class="border-border bg-background fixed inset-y-0 left-0 z-50 w-72 border-r md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div class="flex h-14 items-center justify-between border-b px-4">
            <span class="font-semibold">Navigate</span>
            <button
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              aria-label="Close navigation"
              (click)="closeMobileNav()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <app-sidebar-nav (navigate)="closeMobileNav()" />
        </div>
      }
    </div>
  `,
})
export class Shell {
  protected readonly mobileNavOpen = signal(false);

  constructor(router: Router) {
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.mobileNavOpen.set(false));
  }

  protected toggleMobileNav(): void {
    this.mobileNavOpen.update((v) => !v);
  }
  protected closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
