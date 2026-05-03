import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkPromptInputImports } from 'prompt-kit-ng';

@Component({
  selector: 'app-prompt-input-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkPromptInputImports],
  template: `
    <h2 class="text-xl font-semibold mb-4">Prompt Input</h2>
    <pk-prompt-input
      class="max-w-2xl"
      [(value)]="value"
      (submitted)="onSubmit()"
    >
      <pk-prompt-input-textarea />
      <pk-prompt-input-actions class="justify-end mt-2">
        <pk-prompt-input-action tooltip="Send">
          <button class="rounded-full bg-primary text-primary-foreground px-3 py-1 text-sm" (click)="onSubmit()">
            Send
          </button>
        </pk-prompt-input-action>
      </pk-prompt-input-actions>
    </pk-prompt-input>
    <p class="mt-4 text-sm text-muted-foreground">Last submitted: {{ lastSubmitted() }}</p>
  `,
})
export class PromptInputDemo {
  protected readonly value = signal('');
  protected readonly lastSubmitted = signal('');
  protected onSubmit(): void {
    this.lastSubmitted.set(this.value());
    this.value.set('');
  }
}
