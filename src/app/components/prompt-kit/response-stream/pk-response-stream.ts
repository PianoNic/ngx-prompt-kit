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
  template: `
    @if (mode() === 'typewriter') {
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
  public readonly fadeDuration = input<number | undefined>(undefined);
  public readonly segmentDelay = input<number | undefined>(undefined);
  public readonly characterChunkSize = input<number | undefined>(undefined);
  public readonly class = input<string>('');
  public readonly completed = output<void>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayedText = signal<string>('');
  protected readonly segments = signal<Segment[]>([]);
  private rafId: number | null = null;
  private lastEmittedComplete = '';

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
    this.cancel();
    this.displayedText.set('');
    this.segments.set([]);
    if (!text) return;

    if (!this.isBrowser) {
      this.displayedText.set(text);
      this.updateSegments(text);
      this.markComplete(text);
      return;
    }

    let index = 0;
    let lastFrameTime = 0;
    const tick = (timestamp: number): void => {
      const delay = this.getProcessingDelay();
      if (delay > 0 && timestamp - lastFrameTime < delay) {
        this.rafId = requestAnimationFrame(tick);
        return;
      }
      lastFrameTime = timestamp;

      if (index >= text.length) {
        this.markComplete(text);
        return;
      }
      const chunk = this.getChunkSize();
      const end = Math.min(index + chunk, text.length);
      const next = text.slice(0, end);
      this.displayedText.set(next);
      if (this.mode() === 'fade') this.updateSegments(next);
      index = end;
      if (end < text.length) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.markComplete(text);
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
  }
}
