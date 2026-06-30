import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cn } from '../utils/cn';
import { CHAIN_OF_THOUGHT_STEP_STATE } from './chain-of-thought.state';

@Component({
  selector: 'pk-chain-of-thought-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass()" [style.maxHeight]="state.isOpen() ? maxHeightPx() + 'px' : '0px'">
      <div #inner class="grid grid-cols-[min-content_minmax(0,1fr)] gap-x-4">
        <div class="bg-primary/20 ml-1.75 h-full w-px" [class.hidden]="state.isLast()"></div>
        <div class="ml-1.75 h-full w-px bg-transparent" [class.hidden]="!state.isLast()"></div>
        <div class="mt-2 space-y-2"><ng-content /></div>
      </div>
    </div>
  `,
})
export class PkChainOfThoughtContent implements AfterViewInit {
  public readonly class = input<string>('');

  protected readonly state = inject(CHAIN_OF_THOUGHT_STEP_STATE);
  private readonly inner = viewChild.required<ElementRef<HTMLDivElement>>('inner');
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly maxHeightPx = signal<number>(0);

  protected readonly wrapperClass = computed(() =>
    cn(
      'text-popover-foreground overflow-hidden transition-[max-height] duration-150 ease-out',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.state.isOpen();
      this.measure();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const observer = new ResizeObserver(() => this.measure());
    observer.observe(this.inner().nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
    this.measure();
  }

  private measure(): void {
    const el = this.inner?.()?.nativeElement;
    if (el) this.maxHeightPx.set(el.scrollHeight);
  }
}
