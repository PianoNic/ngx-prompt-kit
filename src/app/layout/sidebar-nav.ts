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
                    class="text-muted-foreground hover:bg-muted hover:text-foreground block rounded px-2 py-1.5 transition-colors"
                  >
                    {{ link.label }}
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
