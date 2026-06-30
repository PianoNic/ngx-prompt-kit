import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
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
  providers: [provideIcons({ lucideMenu, lucideX })],
  template: `
    <div class="bg-background text-foreground min-h-screen">
      <header
        class="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur"
      >
        <hlm-sheet side="left">
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
          <hlm-sheet-content
            *brnSheetContent="let ctx"
            [showCloseButton]="false"
            class="w-72 p-0 overflow-y-auto"
          >
            <div
              class="border-border bg-background sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 pb-2 pt-2"
            >
              <span class="font-semibold tracking-tight">ngx-prompt-kit</span>
              <button
                hlmBtn
                variant="ghost"
                size="icon-sm"
                type="button"
                aria-label="Close navigation"
                (click)="ctx.close()"
              >
                <ng-icon hlm size="sm" name="lucideX" />
              </button>
            </div>
            <div class="pt-2">
              <app-sidebar-nav (navigate)="ctx.close()" />
            </div>
          </hlm-sheet-content>
        </hlm-sheet>

        <a routerLink="/" class="font-semibold tracking-tight" aria-label="ngx-prompt-kit home">
          <span>ngx-prompt-kit</span>
        </a>

        <div class="flex-1"></div>
        <app-theme-toggle />
      </header>

      <div class="md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside class="border-border sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r md:block">
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
