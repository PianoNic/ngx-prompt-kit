import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../utils/cn';

export type LoaderVariant =
  | 'circular'
  | 'classic'
  | 'pulse'
  | 'pulse-dot'
  | 'dots'
  | 'typing'
  | 'wave'
  | 'bars'
  | 'terminal'
  | 'text-blink'
  | 'text-shimmer'
  | 'loading-dots';

export type LoaderSize = 'sm' | 'md' | 'lg';

const SIZE: Record<LoaderSize, string> = { sm: 'size-4', md: 'size-5', lg: 'size-6' };
const TEXT_SIZE: Record<LoaderSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

@Component({
  selector: 'pk-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './loader-keyframes.css',
  template: `
    @switch (variant()) {
      @case ('circular') {
        <div
          [class]="
            cn(
              'border-primary animate-spin rounded-full border-2 border-t-transparent',
              SIZE[size()],
              class()
            )
          "
        >
          <span class="sr-only">Loading</span>
        </div>
      }
      @case ('classic') {
        <div [class]="cn('relative', SIZE[size()], class())">
          <div class="absolute h-full w-full">
            @for (i of twelve; track i) {
              <div
                class="bg-primary absolute rounded-full"
                [style.top]="'0'"
                [style.left]="'50%'"
                [style.marginLeft]="
                  size() === 'sm' ? '-0.75px' : size() === 'lg' ? '-1.25px' : '-1px'
                "
                [style.transformOrigin]="
                  (size() === 'sm' ? '0.75px' : size() === 'lg' ? '1.25px' : '1px') +
                  ' ' +
                  (size() === 'sm' ? '10px' : size() === 'lg' ? '14px' : '12px')
                "
                [style.transform]="'rotate(' + i * 30 + 'deg)'"
                [style.height]="size() === 'sm' ? '6px' : size() === 'lg' ? '10px' : '8px'"
                [style.width]="size() === 'sm' ? '1.5px' : size() === 'lg' ? '2.5px' : '2px'"
                [style.opacity]="0"
                [style.animation]="'spinner-fade 1.2s linear infinite'"
                [style.animationDelay]="i * 0.1 + 's'"
              ></div>
            }
          </div>
        </div>
      }
      @case ('pulse') {
        <div [class]="cn('relative', SIZE[size()], class())">
          <div
            class="border-primary absolute inset-0 rounded-full border-2"
            [style.animation]="'thin-pulse 1.5s ease-in-out infinite'"
          ></div>
        </div>
      }
      @case ('pulse-dot') {
        <div
          [class]="cn('bg-primary rounded-full', pulseDotSize(), class())"
          [style.animation]="'pulse-dot 1.2s ease-in-out infinite'"
        ></div>
      }
      @case ('dots') {
        <div [class]="cn('flex items-center space-x-1', containerSize(), class())">
          @for (i of three; track i) {
            <div
              [class]="cn('bg-primary rounded-full', dotSize())"
              [style.animation]="'bounce-dots 1.4s ease-in-out infinite'"
              [style.animationDelay]="i * 160 + 'ms'"
            ></div>
          }
        </div>
      }
      @case ('typing') {
        <div [class]="cn('flex items-center space-x-1', containerSize(), class())">
          @for (i of three; track i) {
            <div
              [class]="cn('bg-primary rounded-full', typingDotSize())"
              [style.animation]="'typing 1s infinite'"
              [style.animationDelay]="i * 250 + 'ms'"
            ></div>
          }
        </div>
      }
      @case ('wave') {
        <div [class]="cn('flex items-center gap-0.5', containerSize(), class())">
          @for (i of five; track i; let idx = $index) {
            <div
              [class]="cn('bg-primary rounded-full', waveBarWidth())"
              [style.height]="waveHeights()[idx]"
              [style.animation]="'wave 1s ease-in-out infinite'"
              [style.animationDelay]="idx * 100 + 'ms'"
            ></div>
          }
        </div>
      }
      @case ('bars') {
        <div [class]="cn('flex', barsContainer(), class())">
          @for (i of three; track i) {
            <div
              [class]="cn('bg-primary h-full', barsWidth())"
              [style.animation]="'wave-bars 1.2s ease-in-out infinite'"
              [style.animationDelay]="i * 0.2 + 's'"
            ></div>
          }
        </div>
      }
      @case ('terminal') {
        <div [class]="cn('flex items-center space-x-1', containerSize(), class())">
          <span [class]="cn('text-primary font-mono', TEXT_SIZE[size()])">&gt;</span>
          <div
            [class]="cn('bg-primary', terminalCursor())"
            [style.animation]="'blink 1s step-end infinite'"
          ></div>
        </div>
      }
      @case ('text-blink') {
        <div
          [class]="cn('font-medium', TEXT_SIZE[size()], class())"
          [style.animation]="'text-blink 2s ease-in-out infinite'"
        >
          {{ text() }}
        </div>
      }
      @case ('text-shimmer') {
        <div
          [class]="cn('bg-clip-text font-medium text-transparent', TEXT_SIZE[size()], class())"
          [style.background-image]="'linear-gradient(to right, var(--muted-foreground) 40%, var(--foreground) 60%, var(--muted-foreground) 80%)'"
          [style.background-size]="'200% auto'"
          [style.-webkit-background-clip]="'text'"
          [style.animation]="'shimmer 4s infinite linear'"
        >
          {{ text() }}
        </div>
      }
      @case ('loading-dots') {
        <div [class]="cn('inline-flex items-center', class())">
          <span [class]="cn('text-primary font-medium', TEXT_SIZE[size()])">
            {{ text() }}
          </span>
          <span class="inline-flex">
            @for (i of three; track i) {
              <span
                class="text-primary"
                [style.animation]="'loading-dots 1.4s infinite ' + (0.2 + i * 0.2) + 's'"
                >.</span
              >
            }
          </span>
        </div>
      }
    }
  `,
})
export class PkLoader {
  public readonly variant = input<LoaderVariant>('circular');
  public readonly size = input<LoaderSize>('md');
  public readonly text = input<string>('Thinking');
  public readonly class = input<string>('');

  protected readonly cn = cn;
  protected readonly SIZE = SIZE;
  protected readonly TEXT_SIZE = TEXT_SIZE;
  protected readonly three = [0, 1, 2];
  protected readonly five = [0, 1, 2, 3, 4];
  protected readonly twelve = Array.from({ length: 12 }, (_, i) => i);

  protected readonly pulseDotSize = computed(
    () => ({ sm: 'size-1', md: 'size-2', lg: 'size-3' })[this.size()],
  );
  protected readonly containerSize = computed(
    () => ({ sm: 'h-4', md: 'h-5', lg: 'h-6' })[this.size()],
  );
  protected readonly dotSize = computed(
    () => ({ sm: 'h-1.5 w-1.5', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' })[this.size()],
  );
  protected readonly typingDotSize = computed(
    () => ({ sm: 'h-1 w-1', md: 'h-1.5 w-1.5', lg: 'h-2 w-2' })[this.size()],
  );
  protected readonly waveBarWidth = computed(
    () => ({ sm: 'w-0.5', md: 'w-0.5', lg: 'w-1' })[this.size()],
  );
  protected readonly waveHeights = computed<string[]>(
    () =>
      ({
        sm: ['6px', '9px', '12px', '9px', '6px'],
        md: ['8px', '12px', '16px', '12px', '8px'],
        lg: ['10px', '15px', '20px', '15px', '10px'],
      })[this.size()],
  );
  protected readonly barsContainer = computed(
    () => ({ sm: 'h-4 gap-1', md: 'h-5 gap-1.5', lg: 'h-6 gap-2' })[this.size()],
  );
  protected readonly barsWidth = computed(
    () => ({ sm: 'w-1', md: 'w-1.5', lg: 'w-2' })[this.size()],
  );
  protected readonly terminalCursor = computed(
    () => ({ sm: 'h-3 w-1.5', md: 'h-4 w-2', lg: 'h-5 w-2.5' })[this.size()],
  );
}
