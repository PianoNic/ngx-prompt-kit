import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { PkMarkdown } from '../markdown/pk-markdown';
import { cn } from '../utils/cn';

export type PkResponseStreamMode = 'typewriter' | 'fade';

interface Segment {
  text: string;
  index: number;
}

@Component({
  selector: 'pk-response-stream',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pk-response-stream.css',
  imports: [PkMarkdown],
  template: `
    @if (markdown()) {
      <!-- Markdown rendering re-parses the partial source on each tick.
           Fade mode is not supported here — the per-segment animation can't
           wrap individual nodes once the markdown turns into a tree. -->
      <pk-markdown [class]="class()" [content]="displayedText()" />
    } @else if (mode() === 'typewriter') {
      <div [class]="class()">{{ displayedText() }}</div>
    } @else {
      <div [class]="class()" [style.--pk-fade-duration]="fadeDurationMs() + 'ms'">
        <div class="relative">
          @for (seg of segments(); track seg.index; let i = $index) {
            <span
              class="pk-fade-segment"
              [class.pk-fade-segment-space]="isWhitespace(seg.text)"
              [style.animationDelay]="i * segmentDelayMs() + 'ms'"
              >{{ seg.text }}</span
            >
          }
        </div>
      </div>
    }
  `,
})
export class PkResponseStream {
  public readonly textStream = input<string>('');
  public readonly mode = input<PkResponseStreamMode>('typewriter');
  public readonly speed = input<number>(20);
  /**
   * Adapt the reveal rate to the incoming throughput: crawl when caught up
   * with the stream, accelerate when the backlog grows, so the animation
   * never falls unboundedly behind a fast model.
   */
  public readonly adaptive = input<boolean>(false);
  /**
   * Tell the component the source stream has ended. Once `done` is true and
   * every received character has been revealed, `finished` emits exactly once.
   * Lets the consumer keep the animated view alive until the reveal catches up,
   * then swap to its final rendering without cutting the animation short.
   */
  public readonly done = input<boolean>(false);
  public readonly fadeDuration = input<number | undefined>(undefined);
  public readonly segmentDelay = input<number | undefined>(undefined);
  public readonly characterChunkSize = input<number | undefined>(undefined);
  /**
   * Render the revealed slice as markdown via pk-markdown. Forces typewriter
   * cadence — fade mode is incompatible because markdown produces a node tree
   * that can't be split into per-word fade segments.
   */
  public readonly markdown = input<boolean>(false);
  public readonly class = input<string>('');
  public readonly completed = output<void>();
  public readonly finished = output<void>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayedText = signal<string>('');
  protected readonly segments = signal<Segment[]>([]);
  private rafId: number | null = null;
  private lastEmittedComplete = '';
  private finishedEmitted = false;
  /** The text we're animating toward. Updated live when textStream changes. */
  private targetText = '';
  /** How many characters we've revealed so far. The tick advances this. */
  private displayedIndex = 0;

  protected readonly fadeDurationMs = computed(() => {
    const fd = this.fadeDuration();
    if (typeof fd === 'number') return Math.max(10, fd);
    const s = Math.min(100, Math.max(1, this.speed()));
    return Math.round(1000 / Math.sqrt(s));
  });

  protected readonly segmentDelayMs = computed(() => {
    const sd = this.segmentDelay();
    if (typeof sd === 'number') return Math.max(0, sd);
    const s = Math.min(100, Math.max(1, this.speed()));
    return Math.max(1, Math.round(100 / Math.sqrt(s)));
  });

  constructor() {
    effect(() => {
      const text = this.textStream();
      this.start(text);
    });
    // Covers done flipping true after the animation already caught up —
    // markComplete() has already run and will not run again.
    effect(() => {
      if (this.done()) this.maybeEmitFinished();
    });
    this.destroyRef.onDestroy(() => this.cancel());
  }

  protected isWhitespace(s: string): boolean {
    return /^\s+$/.test(s);
  }

  private cancel(): void {
    if (this.rafId !== null && this.isBrowser) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private getChunkSize(): number {
    const cs = this.characterChunkSize();
    if (typeof cs === 'number') return Math.max(1, cs);
    if (this.adaptive()) {
      // Chars per tick scale with how far the reveal lags behind the stream
      // (targeting a ~4s drain of the current backlog), with a 1-char floor so
      // the tail always types character by character and a cap so even huge
      // responses still visibly write instead of dumping.
      const backlog = this.targetText.length - this.displayedIndex;
      const drainMs = 4000;
      return Math.min(12, Math.max(1, Math.round((backlog * this.getProcessingDelay()) / drainMs)));
    }
    const s = Math.min(100, Math.max(1, this.speed()));
    if (this.mode() === 'typewriter') {
      if (s < 25) return 1;
      return Math.max(1, Math.round((s - 25) / 10));
    }
    return 1;
  }

  private getProcessingDelay(): number {
    const sd = this.segmentDelay();
    if (typeof sd === 'number') return Math.max(0, sd);
    const s = Math.min(100, Math.max(1, this.speed()));
    return Math.max(1, Math.round(100 / Math.sqrt(s)));
  }

  private start(text: string): void {
    // Empty string — reset everything, idle.
    if (!text) {
      this.cancel();
      this.displayedText.set('');
      this.segments.set([]);
      this.targetText = '';
      this.displayedIndex = 0;
      this.finishedEmitted = false;
      return;
    }

    const displayed = this.displayedText();

    // Diverged: new text doesn't start with what we've already revealed.
    // Reset and animate from scratch. (Also catches the truncation case
    // where the consumer passes a shorter string than what's on screen.)
    if (!text.startsWith(displayed)) {
      this.cancel();
      this.displayedText.set('');
      this.segments.set([]);
      this.displayedIndex = 0;
    }

    // Prefix extension (or fresh start after the reset above): update the
    // target. The running tick — if any — reads targetText each frame and
    // will keep going past the old length without restarting.
    this.targetText = text;

    // SSR path — no animation, just settle.
    if (!this.isBrowser) {
      this.displayedText.set(text);
      this.updateSegments(text);
      this.displayedIndex = text.length;
      this.markComplete(text);
      return;
    }

    // Already animating — the live tick will pick up the new targetText.
    if (this.rafId !== null) return;

    // Otherwise (idle, animation finished or just reset) kick off a loop
    // from wherever displayedIndex left off.
    this.runTickLoop();
  }

  private runTickLoop(): void {
    let lastFrameTime = 0;
    const tick = (timestamp: number): void => {
      const delay = this.getProcessingDelay();
      if (delay > 0 && timestamp - lastFrameTime < delay) {
        this.rafId = requestAnimationFrame(tick);
        return;
      }
      lastFrameTime = timestamp;

      const target = this.targetText;

      // Caught up to current target — idle, but stay ready for more.
      if (this.displayedIndex >= target.length) {
        this.rafId = null;
        this.markComplete(target);
        return;
      }

      const chunk = this.getChunkSize();
      this.displayedIndex = Math.min(this.displayedIndex + chunk, target.length);
      const next = target.slice(0, this.displayedIndex);
      this.displayedText.set(next);
      if (this.mode() === 'fade') this.updateSegments(next);

      if (this.displayedIndex < target.length) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
        this.markComplete(target);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private updateSegments(text: string): void {
    const list: Segment[] = text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((t, i) => ({ text: t, index: i }));
    this.segments.set(list);
  }

  private markComplete(text: string): void {
    if (this.lastEmittedComplete !== text) {
      this.lastEmittedComplete = text;
      this.completed.emit();
    }
    this.maybeEmitFinished();
  }

  private maybeEmitFinished(): void {
    if (this.finishedEmitted || !this.done()) return;
    if (this.displayedIndex < this.targetText.length) return;
    this.finishedEmitted = true;
    this.finished.emit();
  }
}
