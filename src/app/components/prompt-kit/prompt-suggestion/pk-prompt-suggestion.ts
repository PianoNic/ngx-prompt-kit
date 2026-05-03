import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmButton, type ButtonVariants } from '@spartan-ng/helm/button';
import { cn } from '../utils/cn';

interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

@Component({
  selector: 'pk-prompt-suggestion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton],
  template: `
    <button
      hlmBtn
      type="button"
      [variant]="resolvedVariant()"
      [size]="resolvedSize()"
      [class]="computedClass()"
      (click)="clicked.emit()"
    >
      @if (isHighlightMode() && content()) {
        @for (seg of segments(); track $index) {
          <span
            class="whitespace-pre-wrap"
            [class.text-muted-foreground]="!seg.highlighted"
            [class.text-primary]="seg.highlighted"
            [class.font-medium]="seg.highlighted"
            >{{ seg.text }}</span
          >
        }
      } @else {
        <ng-content />
        @if (content()) {
          <span>{{ content() }}</span>
        }
      }
    </button>
  `,
})
export class PkPromptSuggestion {
  public readonly content = input<string>('');
  public readonly highlight = input<string>('');
  public readonly variant = input<ButtonVariants['variant'] | undefined>(undefined);
  public readonly size = input<ButtonVariants['size'] | undefined>(undefined);
  public readonly class = input<string>('');
  public readonly clicked = output<void>();

  protected readonly isHighlightMode = computed(() => this.highlight().trim() !== '');

  protected readonly resolvedVariant = computed<ButtonVariants['variant']>(() => {
    if (this.variant()) return this.variant()!;
    if (!this.isHighlightMode()) return 'outline';
    return 'ghost';
  });

  protected readonly resolvedSize = computed<ButtonVariants['size']>(() => {
    if (this.size()) return this.size()!;
    if (!this.isHighlightMode()) return 'lg';
    return 'sm';
  });

  protected readonly computedClass = computed(() => {
    if (!this.isHighlightMode()) return cn('rounded-full', this.class());
    return cn(
      'w-full cursor-pointer justify-start gap-0 rounded-xl py-2',
      'hover:bg-accent',
      this.class(),
    );
  });

  protected readonly segments = computed<HighlightSegment[]>(() => {
    const content = this.content();
    const hl = this.highlight().trim();
    if (!content || !hl) return [{ text: content, highlighted: false }];
    const lower = content.toLowerCase();
    const idx = lower.indexOf(hl.toLowerCase());
    if (idx === -1) return [{ text: content, highlighted: false }];
    const result: HighlightSegment[] = [];
    if (idx > 0) result.push({ text: content.substring(0, idx), highlighted: false });
    result.push({ text: content.substring(idx, idx + hl.length), highlighted: true });
    if (idx + hl.length < content.length) {
      result.push({ text: content.substring(idx + hl.length), highlighted: false });
    }
    return result;
  });
}
