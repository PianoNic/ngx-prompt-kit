/**
 * pk-source — citation card with hover-card preview.
 *
 * Provides SOURCE_STATE for child components (pk-source-trigger, pk-source-content)
 * via DI, holding the href + extracted domain. Spartan's HlmHoverCard wraps the
 * trigger + content; we additionally provide BrnHoverCardContentService at the
 * pk-source level so that projected pk-source-content can resolve it (the
 * service is normally provided by BrnHoverCard at its own host, but ng-content
 * projection breaks the NodeInjector chain in some Angular versions).
 */
import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { BrnHoverCardContentService } from '@spartan-ng/brain/hover-card';
import { HlmHoverCard } from '@spartan-ng/helm/hover-card';
import { SOURCE_STATE, type SourceState } from './source.state';

@Component({
  selector: 'pk-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmHoverCard],
  providers: [
    { provide: SOURCE_STATE, useExisting: forwardRef(() => PkSource) },
    BrnHoverCardContentService,
  ],
  template: `<hlm-hover-card><ng-content /></hlm-hover-card>`,
})
export class PkSource implements SourceState {
  public readonly href = input.required<string>();

  public readonly domain = computed(() => {
    const h = this.href();
    try {
      return new URL(h).hostname;
    } catch {
      return h.split('/').pop() || h;
    }
  });
}
