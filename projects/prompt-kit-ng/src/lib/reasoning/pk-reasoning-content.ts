import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { PkMarkdown } from '../markdown/pk-markdown';
import { cn } from '../utils/cn';
import { REASONING_STATE } from './reasoning.state';

@Component({
  selector: 'pk-reasoning-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMarkdown],
  template: `
    <div
      #wrapper
      [class]="computedClass()"
      [style.maxHeight]="state.isOpen() ? maxHeightPx() + 'px' : '0px'"
    >
      <div #inner [class]="innerClass()">
        @if (markdown()) {
          <pk-markdown [content]="content() ?? ''" />
        } @else {
          @if (content(); as c) {
            {{ c }}
          }
          <ng-content />
        }
      </div>
    </div>
  `,
})
export class PkReasoningContent implements AfterViewInit {
  public readonly markdown = input<boolean>(false);
  public readonly content = input<string | undefined>(undefined);
  public readonly class = input<string>('');
  public readonly contentClass = input<string>('');

  protected readonly state = inject(REASONING_STATE);
  protected readonly inner = viewChild.required<ElementRef<HTMLDivElement>>('inner');
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly maxHeightPx = signal<number>(0);

  protected readonly computedClass = computed(() =>
    cn('overflow-hidden transition-[max-height] duration-150 ease-out', this.class()),
  );
  protected readonly innerClass = computed(() =>
    cn('text-muted-foreground prose prose-sm dark:prose-invert', this.contentClass()),
  );

  constructor() {
    effect(() => {
      // re-measure on open changes
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
