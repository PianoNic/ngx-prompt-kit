/**
 * pk-system-message — out-of-band notice (action / error / warning) with
 * optional CTA button. Distinct from a normal chat message.
 *
 * Inputs:
 *   text:        string  — main label (alternative: project via <ng-content>)
 *   variant:     'action' | 'error' | 'warning' (default 'action')
 *   fill:        boolean — solid background variant (default false)
 *   icon:        boolean — show the variant's default icon (default true)
 *   ctaLabel:    string  — when set, renders a Spartan button on the right
 *   class:       string
 *
 * Outputs:
 *   ctaClicked:  EventEmitter<void>
 *
 * Mirrors ibelick/prompt-kit system-message API but uses explicit boolean
 * inputs (icon, ctaLabel) instead of React's "node-or-undefined" pattern.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideInfo, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

export type SystemMessageVariant = 'action' | 'error' | 'warning';

const variants = cva('flex flex-row items-center gap-3 rounded-[12px] border py-2 pr-2 pl-3', {
  variants: {
    variant: {
      action: 'text-zinc-700 dark:text-zinc-300',
      error: 'text-red-700 dark:text-red-800',
      warning: 'text-amber-700 dark:text-amber-700',
    },
    fill: { true: 'bg-background', false: '' },
  },
  compoundVariants: [
    { variant: 'action', fill: true, class: 'bg-zinc-100 dark:bg-zinc-900 border-transparent' },
    { variant: 'error', fill: true, class: 'bg-red-100 dark:bg-red-900/20 border-transparent' },
    {
      variant: 'warning',
      fill: true,
      class: 'bg-amber-100 dark:bg-amber-900/20 border-transparent',
    },
    { variant: 'action', fill: false, class: 'border-zinc-200 dark:border-zinc-800' },
    { variant: 'error', fill: false, class: 'border-red-600 dark:border-red-900' },
    { variant: 'warning', fill: false, class: 'border-amber-600 dark:border-amber-900' },
  ],
  defaultVariants: { variant: 'action', fill: false },
});

@Component({
  selector: 'pk-system-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports],
  providers: [provideIcons({ lucideCircleAlert, lucideInfo, lucideTriangleAlert })],
  template: `
    <div [class]="computedClass()">
      <div class="flex flex-1 flex-row items-center gap-3 leading-normal">
        @if (icon()) {
          <div class="flex h-[1lh] shrink-0 items-center justify-center self-start">
            <ng-icon hlm size="sm" [name]="iconName()" />
          </div>
        }
        <div class="flex min-w-0 flex-1 items-center" [class.gap-3]="icon()">
          <div class="text-sm">
            @if (text(); as t) {
              {{ t }}
            }
            <ng-content />
          </div>
        </div>
      </div>
      @if (ctaLabel(); as cta) {
        <button hlmBtn size="sm" type="button" (click)="ctaClicked.emit()">{{ cta }}</button>
      }
    </div>
  `,
})
export class PkSystemMessage {
  public readonly text = input<string>('');
  public readonly variant = input<SystemMessageVariant>('action');
  public readonly fill = input<boolean>(false);
  public readonly icon = input<boolean>(true);
  public readonly ctaLabel = input<string>('');
  public readonly class = input<string>('');
  public readonly ctaClicked = output<void>();

  protected readonly computedClass = computed(() =>
    cn(variants({ variant: this.variant(), fill: this.fill() }), this.class()),
  );

  protected readonly iconName = computed(() => {
    switch (this.variant()) {
      case 'error':
        return 'lucideCircleAlert';
      case 'warning':
        return 'lucideTriangleAlert';
      default:
        return 'lucideInfo';
    }
  });
}
