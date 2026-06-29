import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HlmHoverCardTrigger } from '@spartan-ng/helm/hover-card';
import { cn } from '../utils/cn';
import { SOURCE_STATE } from './source.state';

@Component({
  selector: 'pk-source-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmHoverCardTrigger],
  template: `
    <a
      hlmHoverCardTrigger
      [href]="state.href()"
      target="_blank"
      rel="noopener noreferrer"
      [class]="computedClass()"
    >
      @if (showFavicon()) {
        <img [src]="favicon()" alt="favicon" width="14" height="14" class="size-3.5 rounded-full" />
      }
      <span class="truncate tabular-nums text-center font-normal">{{ resolvedLabel() }}</span>
    </a>
  `,
})
export class PkSourceTrigger {
  public readonly label = input<string | number | undefined>(undefined);
  public readonly showFavicon = input<boolean>(false);
  public readonly class = input<string>('');

  protected readonly state = inject(SOURCE_STATE);

  protected readonly resolvedLabel = computed(() => {
    const l = this.label();
    if (l !== undefined) return String(l);
    return this.state.domain().replace('www.', '');
  });

  protected readonly favicon = computed(
    () =>
      `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(this.state.href())}`,
  );

  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted text-muted-foreground hover:bg-muted-foreground/30 hover:text-primary inline-flex h-5 max-w-32 items-center gap-1 overflow-hidden rounded-full py-0 text-xs no-underline transition-colors duration-150',
      this.showFavicon() ? 'pr-2 pl-1' : 'px-1',
      this.class(),
    ),
  );
}
