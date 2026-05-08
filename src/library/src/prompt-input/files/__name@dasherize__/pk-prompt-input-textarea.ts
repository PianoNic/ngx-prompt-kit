import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { cn } from '../utils/cn';
import { PROMPT_INPUT_STATE } from './prompt-input.state';

@Component({
  selector: 'pk-prompt-input-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTextarea],
  template: `
    <textarea
      hlmTextarea
      #ta
      [class]="computedClass()"
      [value]="state.value()"
      [disabled]="state.disabled()"
      [attr.placeholder]="placeholder() || null"
      (input)="onInput($event)"
      (keydown)="onKeyDown($event)"
      rows="1"
    ></textarea>
  `,
})
export class PkPromptInputTextarea implements AfterViewInit {
  public readonly disableAutosize = input<boolean>(false);
  public readonly class = input<string>('');
  public readonly placeholder = input<string>('');

  protected readonly state = inject(PROMPT_INPUT_STATE);
  protected readonly ta = viewChild.required<ElementRef<HTMLTextAreaElement>>('ta');

  protected readonly computedClass = computed(() =>
    cn(
      'text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      // re-adjust on value/maxHeight changes
      this.state.value();
      this.state.maxHeight();
      const el = this.ta?.()?.nativeElement;
      if (el) this.adjustHeight(el);
    });
  }

  ngAfterViewInit(): void {
    this.state.registerTextarea(this.ta());
    this.adjustHeight(this.ta().nativeElement);
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.adjustHeight(el);
    this.state.setValue(el.value);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.state.submit();
    }
  }

  private adjustHeight(el: HTMLTextAreaElement): void {
    if (this.disableAutosize()) return;
    el.style.height = 'auto';
    const max = this.state.maxHeight();
    if (typeof max === 'number') {
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    } else {
      el.style.height = `min(${el.scrollHeight}px, ${max})`;
    }
  }
}
