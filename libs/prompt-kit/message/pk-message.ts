import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

/**
 * @deprecated Superseded by `HlmMessage` from `@spartan-ng/helm/message` (spartan 1.3.0+).
 *
 * `HlmMessage` applies the same row layout and additionally provides an `align` input
 * (`'start' | 'end'`) and the `group/message` context that `HlmMessageHeader`,
 * `HlmMessageFooter` and `HlmMessageAvatar` key their alignment off. This component is a
 * plain `flex gap-3` wrapper with no such context.
 *
 * Migrate:
 * ```html
 * <!-- before -->
 * <pk-message class="justify-end">…</pk-message>
 * <!-- after -->
 * <div hlmMessage align="end">…</div>
 * ```
 *
 * Kept for backwards compatibility; it will be removed in a future major.
 */
@Component({
  selector: 'pk-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkMessage {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex gap-3', this.class()));
}
