// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideRefreshCw, lucideRotateCcw, lucideSquare } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

export type StreamControlsState = 'idle' | 'streaming' | 'error';

@Component({
  selector: 'pk-stream-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports],
  providers: [provideIcons({ lucideSquare, lucideRefreshCw, lucideRotateCcw })],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    @switch (state()) {
      @case ('streaming') {
        <button
          hlmBtn
          variant="secondary"
          size="sm"
          type="button"
          (click)="stop.emit()"
          aria-label="Stop streaming"
        >
          <ng-icon hlm size="xs" name="lucideSquare" />
          Stop
        </button>
      }
      @case ('error') {
        <button
          hlmBtn
          variant="outline"
          size="sm"
          type="button"
          class="text-destructive border-destructive/40 hover:bg-destructive/10"
          (click)="regenerate.emit()"
          aria-label="Try again"
        >
          <ng-icon hlm size="xs" name="lucideRotateCcw" />
          Try again
        </button>
      }
      @default {
        @if (canRegenerate()) {
          <button
            hlmBtn
            variant="ghost"
            size="sm"
            type="button"
            (click)="regenerate.emit()"
            aria-label="Regenerate response"
          >
            <ng-icon hlm size="xs" name="lucideRefreshCw" />
            Regenerate
          </button>
        }
      }
    }
  `,
})
export class PkStreamControls {
  public readonly state = input.required<StreamControlsState>();
  public readonly canRegenerate = input<boolean>(true);
  public readonly class = input<string>('');

  public readonly stop = output<void>();
  public readonly regenerate = output<void>();

  protected readonly computedClass = computed(() => cn('inline-flex items-center', this.class()));
}
