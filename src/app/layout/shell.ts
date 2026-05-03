import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { BrnSheetContent, BrnSheetTrigger } from '@spartan-ng/brain/sheet';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSheet, HlmSheetContent } from '@spartan-ng/helm/sheet';
import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterOutlet,
    HlmButton,
    HlmIconImports,
    HlmSheet,
    HlmSheetContent,
    BrnSheetTrigger,
    BrnSheetContent,
    SidebarNav,
    ThemeToggle,
  ],
  providers: [provideIcons({ lucideMenu })],
  template: `
    <div class="bg-background text-foreground min-h-screen">
      <header
        class="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur"
      >
        <hlm-sheet>
          <button
            hlmBtn
            brnSheetTrigger
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="Open navigation"
            class="md:hidden"
          >
            <ng-icon hlm size="sm" name="lucideMenu" />
          </button>
          <hlm-sheet-content *brnSheetContent="let ctx" side="left" class="w-72 p-0">
            <app-sidebar-nav (navigate)="ctx.close()" />
          </hlm-sheet-content>
        </hlm-sheet>

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

        <main class="min-h-[calc(100vh-3.5rem)] px-6 py-8 md:px-10">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Shell {}
