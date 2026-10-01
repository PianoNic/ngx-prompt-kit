import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMic, lucideSquare } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';

type State = 'idle' | 'recording' | 'transcribing';

@Component({
  selector: 'app-block-voice-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, HlmButton, HlmInputGroupImports, HlmTooltip, NgIcon],
  providers: [provideIcons({ lucideArrowUp, lucideMic, lucideSquare })],
  template: `
    <app-block-page
      title="Voice input"
      description="Hold the mic to dictate. While the audio is being transcribed, a shimmering label (spartan's shimmer utility) sits above the input until the transcript drops in."
    >
      <app-doc-example title="Mic → transcribing → ready to send" [code]="code">
        <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
          @if (state() === 'transcribing') {
            <span role="status" class="shimmer text-muted-foreground text-sm font-medium">
              Transcribing audio…
            </span>
          }

          <div hlmInputGroup class="rounded-3xl">
            <textarea
              hlmInputGroupTextarea
              class="max-h-60 px-4 pt-3"
              aria-label="Message"
              [placeholder]="state() === 'recording' ? 'Listening...' : 'Speak or type'"
              [value]="value()"
              (input)="value.set($any($event.target).value)"
              (keydown.enter)="onEnter($event)"
            ></textarea>
            <div hlmInputGroupAddon align="block-end" class="justify-between px-3 pb-3">
              <button
                hlmBtn
                size="icon-sm"
                [variant]="state() === 'recording' ? 'destructive' : 'ghost'"
                type="button"
                class="rounded-full"
                [hlmTooltip]="state() === 'recording' ? 'Stop' : 'Voice'"
                aria-label="Toggle voice"
                (click)="toggleVoice()"
              >
                <ng-icon
                  class="text-[length:--spacing(4)]"
                  [name]="state() === 'recording' ? 'lucideSquare' : 'lucideMic'"
                />
              </button>
              <button
                hlmBtn
                size="icon-sm"
                type="button"
                class="rounded-full"
                hlmTooltip="Send"
                [disabled]="state() !== 'idle' || !value().trim()"
                (click)="onSubmit()"
                aria-label="Send"
              >
                <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
              </button>
            </div>
          </div>

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
      this.value.set("Walk me through last week's deploy regressions.");
      this.state.set('idle');
    }, 1100);
  }

  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    if (this.state() === 'idle') this.onSubmit();
  }

  protected onSubmit(): void {
    const v = this.value().trim();
    if (!v) return;
    this.lastSent.set(v);
    this.value.set('');
  }

  protected readonly code = `@if (state() === 'transcribing') {
  <!-- spartan's shimmer utility -->
  <span role="status" class="shimmer text-muted-foreground text-sm">Transcribing audio…</span>
}

<!-- spartan input-group: textarea plus a block-end addon -->
<div hlmInputGroup class="rounded-3xl">
  <textarea
    hlmInputGroupTextarea
    [placeholder]="state() === 'recording' ? 'Listening...' : 'Speak or type'"
    [value]="value()"
    (input)="value.set($any($event.target).value)"
    (keydown.enter)="onEnter($event)"
  ></textarea>
  <div hlmInputGroupAddon align="block-end" class="justify-between">
    <button hlmBtn size="icon-sm"
            [variant]="state() === 'recording' ? 'destructive' : 'ghost'"
            [hlmTooltip]="state() === 'recording' ? 'Stop' : 'Voice'"
            (click)="toggleVoice()">
      <ng-icon class="text-[length:--spacing(4)]"
               [name]="state() === 'recording' ? 'lucideSquare' : 'lucideMic'" />
    </button>
    <button hlmBtn size="icon-sm" class="rounded-full" hlmTooltip="Send"
            [disabled]="state() !== 'idle' || !value().trim()"
            (click)="onSubmit()">
      <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
    </button>
  </div>
</div>

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
