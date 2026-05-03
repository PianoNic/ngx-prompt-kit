import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkResponseStream } from 'prompt-kit-ng/response-stream';

@Component({
  selector: 'app-response-stream-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkResponseStream],
  template: `
    <h2 class="text-xl font-semibold mb-4">Response Stream</h2>
    <button class="mb-4 rounded bg-primary text-primary-foreground px-3 py-1 text-sm" (click)="restart()">Restart</button>
    <pk-response-stream class="block max-w-2xl" [textStream]="text()" mode="typewriter" [speed]="40" />
    <h3 class="mt-6 mb-2 font-semibold">Fade mode</h3>
    <pk-response-stream class="block max-w-2xl" [textStream]="text()" mode="fade" [speed]="40" />
  `,
})
export class ResponseStreamDemo {
  protected readonly text = signal(
    'This is a streamed response that reveals one chunk at a time, simulating an AI assistant typing.',
  );
  protected restart(): void {
    const t = this.text();
    this.text.set('');
    setTimeout(() => this.text.set(t), 50);
  }
}
