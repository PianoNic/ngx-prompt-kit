import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV } from './nav-data';

@Component({
  selector: 'app-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="h-full overflow-y-auto">
      <nav class="flex flex-col gap-6 p-4 text-sm">
        @for (group of nav; track group.heading) {
          <div>
            <p
              class="text-muted-foreground mb-2 px-2 text-xs font-medium uppercase tracking-wider"
            >
              {{ group.heading }}
            </p>
            <ul class="flex flex-col gap-0.5">
              @for (link of group.links; track link.path) {
                <li>
                  <a
                    [routerLink]="link.path"
                    routerLinkActive="bg-accent text-accent-foreground font-medium"
                    [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                    (click)="navigate.emit()"
                    class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-between gap-2 rounded px-2 py-1.5 transition-colors"
                  >
                    <span>{{ link.label }}</span>
                    @if (link.badge; as b) {
                      <span
                        class="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                      >
                        {{ b }}
                      </span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>
    </div>
  `,
})
export class SidebarNav {
  public readonly navigate = output<void>();
  protected readonly nav = NAV;
}
