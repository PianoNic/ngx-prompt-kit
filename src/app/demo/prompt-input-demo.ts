import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMic, lucidePaperclip } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkPromptInputImports } from 'prompt-kit-ng/prompt-input';

@Component({
  selector: 'app-prompt-input-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, HlmButton, HlmIconImports, PkPromptInputImports],
  providers: [provideIcons({ lucideArrowUp, lucideMic, lucidePaperclip })],
  template: `
    <app-doc-page
      title="Prompt Input"
      description="A chat-style input with autosizing textarea, action slot, and submit on Enter (Shift+Enter for newline)."
    >
      <app-doc-example
        title="Basic input"
        description="Type and press Enter to submit. The value below shows what was sent."
        [code]="basicCode"
      >
        <div class="w-full max-w-2xl">
          <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
            <pk-prompt-input-textarea placeholder="Type a message..." />
            <pk-prompt-input-actions class="mt-2 justify-end gap-1">
              <pk-prompt-input-action tooltip="Send">
                <button hlmBtn size="icon-sm" type="button" class="rounded-full" (click)="onSubmit()" aria-label="Send">
                  <ng-icon hlm size="xs" name="lucideArrowUp" />
                </button>
              </pk-prompt-input-action>
            </pk-prompt-input-actions>
          </pk-prompt-input>
          <p class="text-muted-foreground mt-3 text-xs">
            Last submitted:
            <span class="text-foreground font-mono">{{ lastSubmitted() || '—' }}</span>
          </p>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Multiple actions"
        description="Multi-action toolbar — attach, voice, send."
        [code]="multiCode"
      >
        <pk-prompt-input class="w-full max-w-2xl" [(value)]="multiValue">
          <pk-prompt-input-textarea placeholder="Ask anything..." />
          <pk-prompt-input-actions class="mt-2 justify-between">
            <div class="flex gap-1">
              <pk-prompt-input-action tooltip="Attach file">
                <button hlmBtn size="icon-sm" variant="ghost" type="button" aria-label="Attach">
                  <ng-icon hlm size="sm" name="lucidePaperclip" />
                </button>
              </pk-prompt-input-action>
              <pk-prompt-input-action tooltip="Voice">
                <button hlmBtn size="icon-sm" variant="ghost" type="button" aria-label="Voice">
                  <ng-icon hlm size="sm" name="lucideMic" />
                </button>
              </pk-prompt-input-action>
            </div>
            <pk-prompt-input-action tooltip="Send">
              <button hlmBtn size="icon-sm" type="button" class="rounded-full" aria-label="Send">
                <ng-icon hlm size="xs" name="lucideArrowUp" />
              </button>
            </pk-prompt-input-action>
          </pk-prompt-input-actions>
        </pk-prompt-input>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class PromptInputDemo {
  protected readonly value = signal('');
  protected readonly multiValue = signal('');
  protected readonly lastSubmitted = signal('');
  protected onSubmit(): void {
    const v = this.value().trim();
    if (!v) return;
    this.lastSubmitted.set(v);
    this.value.set('');
  }

  protected readonly basicCode = `<pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
  <pk-prompt-input-textarea placeholder="Type a message..." />
  <pk-prompt-input-actions class="mt-2 justify-end">
    <pk-prompt-input-action tooltip="Send">
      <button hlmBtn size="icon-sm" class="rounded-full" (click)="onSubmit()">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>`;

  protected readonly multiCode = `<pk-prompt-input [(value)]="value">
  <pk-prompt-input-textarea placeholder="Ask anything..." />
  <pk-prompt-input-actions class="mt-2 justify-between">
    <div class="flex gap-1">
      <pk-prompt-input-action tooltip="Attach file">
        <button hlmBtn size="icon-sm" variant="ghost">
          <ng-icon hlm size="sm" name="lucidePaperclip" />
        </button>
      </pk-prompt-input-action>
      <pk-prompt-input-action tooltip="Voice">
        <button hlmBtn size="icon-sm" variant="ghost">
          <ng-icon hlm size="sm" name="lucideMic" />
        </button>
      </pk-prompt-input-action>
    </div>
    <pk-prompt-input-action tooltip="Send">
      <button hlmBtn size="icon-sm" class="rounded-full">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>`;
}
