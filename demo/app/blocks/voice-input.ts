import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMic, lucideSquare } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkPromptInputImports } from 'ngx-prompt-kit/prompt-input';
import { PkTextShimmer } from 'ngx-prompt-kit/text-shimmer';

type State = 'idle' | 'recording' | 'transcribing';

@Component({
  selector: 'app-block-voice-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkPromptInputImports,
    PkTextShimmer,
  ],
  providers: [provideIcons({ lucideArrowUp, lucideMic, lucideSquare })],
  template: `
    <app-block-page
      title="Voice input"
      description="Hold the mic to dictate. While the audio is being transcribed, a text-shimmer label sits above the input until the transcript drops in."
    >
      <app-doc-example title="Mic → transcribing → ready to send" [code]="code">
        <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
          @if (state() === 'transcribing') {
            <pk-text-shimmer text="Transcribing audio…" class="text-sm" />
          }

          <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
            <pk-prompt-input-textarea
              [placeholder]="state() === 'recording' ? 'Listening...' : 'Speak or type'"
            />
            <pk-prompt-input-actions class="mt-2 justify-between">
              <pk-prompt-input-action [tooltip]="state() === 'recording' ? 'Stop' : 'Voice'">
                <button
                  hlmBtn
                  size="icon-sm"
                  [variant]="state() === 'recording' ? 'destructive' : 'ghost'"
                  type="button"
                  class="rounded-full"
                  aria-label="Toggle voice"
                  (click)="toggleVoice()"
                >
                  <ng-icon
                    hlm
                    size="sm"
                    [name]="state() === 'recording' ? 'lucideSquare' : 'lucideMic'"
                  />
                </button>
              </pk-prompt-input-action>
              <pk-prompt-input-action tooltip="Send">
                <button
                  hlmBtn
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  [disabled]="state() !== 'idle' || !value().trim()"
                  (click)="onSubmit()"
                  aria-label="Send"
                >
                  <ng-icon hlm size="xs" name="lucideArrowUp" />
                </button>
              </pk-prompt-input-action>
            </pk-prompt-input-actions>
          </pk-prompt-input>

          <p class="text-muted-foreground text-xs">
            State: <span class="text-foreground font-mono">{{ state() }}</span>
            @if (lastSent(); as msg) {
              · last sent: <span class="text-foreground font-mono">{{ msg }}</span>
            }
          </p>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class VoiceInputBlock {
  protected readonly state = signal<State>('idle');
  protected readonly value = signal('');
  protected readonly lastSent = signal<string | null>(null);

  protected toggleVoice(): void {
    if (this.state() === 'idle') {
      this.state.set('recording');
      // simulate the user releasing after 1.6s
      setTimeout(() => this.finishRecording(), 1600);
    } else if (this.state() === 'recording') {
      this.finishRecording();
    }
  }

  private finishRecording(): void {
    this.state.set('transcribing');
    setTimeout(() => {
      this.value.set('Walk me through last week\'s deploy regressions.');
      this.state.set('idle');
    }, 1100);
  }

  protected onSubmit(): void {
    const v = this.value().trim();
    if (!v) return;
    this.lastSent.set(v);
    this.value.set('');
  }

  protected readonly code = `@if (state() === 'transcribing') {
  <pk-text-shimmer text="Transcribing audio…" class="text-sm" />
}

<pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
  <pk-prompt-input-textarea
    [placeholder]="state() === 'recording' ? 'Listening...' : 'Speak or type'"
  />
  <pk-prompt-input-actions class="mt-2 justify-between">
    <pk-prompt-input-action [tooltip]="state() === 'recording' ? 'Stop' : 'Voice'">
      <button hlmBtn size="icon-sm"
              [variant]="state() === 'recording' ? 'destructive' : 'ghost'"
              (click)="toggleVoice()">
        <ng-icon hlm size="sm"
                 [name]="state() === 'recording' ? 'lucideSquare' : 'lucideMic'" />
      </button>
    </pk-prompt-input-action>
    <pk-prompt-input-action tooltip="Send">
      <button hlmBtn size="icon-sm" class="rounded-full"
              [disabled]="state() !== 'idle' || !value().trim()"
              (click)="onSubmit()">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>

// Component
type State = 'idle' | 'recording' | 'transcribing';
protected readonly state = signal<State>('idle');

protected toggleVoice(): void {
  if (this.state() === 'idle') {
    this.state.set('recording');
    // wire MediaRecorder here
  } else if (this.state() === 'recording') {
    this.finishRecording(); // upload + state.set('transcribing')
  }
}`;
}
