import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';
import { HlmHoverCardContent } from '@spartan-ng/helm/hover-card';
import { cn } from '../utils/cn';
import { SOURCE_STATE } from './source.state';

@Component({
  selector: 'pk-source-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmHoverCardContent, BrnHoverCardContent],
  template: `
    <div *brnHoverCardContent hlmHoverCardContent [class]="computedClass()">
      <a
        [href]="state.href()"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col gap-2 p-3"
      >
        <div class="flex items-center gap-1.5">
          <img [src]="favicon()" alt="favicon" class="size-4 rounded-full" width="16" height="16" />
          <div class="text-primary truncate text-sm">{{ shortDomain() }}</div>
        </div>
        <div class="line-clamp-2 text-sm font-medium">{{ title() }}</div>
        <div class="text-muted-foreground line-clamp-2 text-sm">{{ description() }}</div>
      </a>
    </div>
  `,
})
export class PkSourceContent {
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();
  public readonly class = input<string>('');

  protected readonly state = inject(SOURCE_STATE);

  protected readonly shortDomain = computed(() => this.state.domain().replace('www.', ''));

  protected readonly favicon = computed(
    () =>
      `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(this.state.href())}`,
  );

  protected readonly computedClass = computed(() => cn('w-80 p-0 shadow-xs', this.class()));
}
