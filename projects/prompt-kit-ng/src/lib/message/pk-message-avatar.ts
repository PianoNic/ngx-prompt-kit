import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-message-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAvatar, HlmAvatarImage, HlmAvatarFallback],
  template: `
    <hlm-avatar [class]="computedClass()">
      <img hlmAvatarImage [src]="src()" [alt]="alt()" />
      @if (fallback(); as fb) {
        <span hlmAvatarFallback>{{ fb }}</span>
      }
    </hlm-avatar>
  `,
})
export class PkMessageAvatar {
  public readonly src = input.required<string>();
  public readonly alt = input.required<string>();
  public readonly fallback = input<string | undefined>(undefined);
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('h-8 w-8 shrink-0', this.class()));
}
