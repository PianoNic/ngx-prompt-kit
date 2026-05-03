import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { filter, map, startWith } from 'rxjs/operators';
import { NAV, type NavLink } from './nav-data';

const FLAT: NavLink[] = NAV.flatMap((g) => g.links);

@Component({
  selector: 'app-doc-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmButton, HlmIconImports],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <nav class="border-border mt-16 flex items-center justify-between gap-4 border-t pt-6">
      @if (prev(); as p) {
        <a hlmBtn variant="outline" size="sm" [routerLink]="p.path" class="gap-1">
          <ng-icon hlm size="xs" name="lucideChevronLeft" />
          {{ p.label }}
        </a>
      } @else {
        <span></span>
      }

      @if (next(); as n) {
        <a hlmBtn variant="outline" size="sm" [routerLink]="n.path" class="gap-1">
          {{ n.label }}
          <ng-icon hlm size="xs" name="lucideChevronRight" />
        </a>
      } @else {
        <span></span>
      }
    </nav>
  `,
})
export class DocNav {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  protected readonly prev = computed(() => {
    const i = FLAT.findIndex((l) => l.path === this.url());
    return i > 0 ? FLAT[i - 1] : null;
  });

  protected readonly next = computed(() => {
    const i = FLAT.findIndex((l) => l.path === this.url());
    return i >= 0 && i < FLAT.length - 1 ? FLAT[i + 1] : null;
  });
}
