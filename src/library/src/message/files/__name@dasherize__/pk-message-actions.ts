import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

/**
 * @deprecated Superseded by `HlmMessageFooter` from `@spartan-ng/helm/message` (spartan 1.3.0+).
 *
 * `HlmMessageFooter` carries the same `text-muted-foreground flex items-center` row and
 * additionally flips its justification for end-aligned messages
 * (`group-data-[align=end]/message:justify-end`), which this component cannot do because it
 * has no message context to read.
 *
 * Migrate:
 * ```html
 * <!-- before -->
 * <pk-message-actions>…</pk-message-actions>
 * <!-- after -->
 * <div hlmMessageFooter>…</div>
 * ```
 *
 * Kept for backwards compatibility; it will be removed in a future major.
 */
@Component({
  selector: 'pk-message-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkMessageActions {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground flex items-center gap-2', this.class()),
  );
}
