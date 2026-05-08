import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { cn } from '../utils/cn';
import { PROMPT_INPUT_STATE, type PromptInputState } from './prompt-input.state';

@Component({
  selector: 'pk-prompt-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
    '(click)': 'onClick()',
  },
  providers: [{ provide: PROMPT_INPUT_STATE, useExisting: forwardRef(() => PkPromptInput) }],
  template: `<ng-content />`,
})
export class PkPromptInput implements PromptInputState {
  public readonly isLoading = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly maxHeight = input<number | string>(240);
  public readonly value = model<string>('');
  public readonly class = input<string>('');
  public readonly submitted = output<void>();

  public readonly textareaRef = signal<ElementRef<HTMLTextAreaElement> | null>(null);

  protected readonly computedClass = computed(() =>
    cn(
      'border-input bg-background cursor-text rounded-3xl border p-2 shadow-xs block',
      this.disabled() && 'cursor-not-allowed opacity-60',
      this.class(),
    ),
  );

  protected onClick(): void {
    if (!this.disabled()) {
      this.textareaRef()?.nativeElement.focus();
    }
  }

  setValue(v: string): void {
    this.value.set(v);
  }
  submit(): void {
    this.submitted.emit();
  }
  registerTextarea(ref: ElementRef<HTMLTextAreaElement>): void {
    this.textareaRef.set(ref);
  }
}
