import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import { HlmHoverCard } from '@spartan-ng/helm/hover-card';
import { SOURCE_STATE, type SourceState } from './source.state';

@Component({
  selector: 'pk-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmHoverCard],
  providers: [{ provide: SOURCE_STATE, useExisting: forwardRef(() => PkSource) }],
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
