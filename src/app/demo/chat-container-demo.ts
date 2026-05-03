import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkChatContainerImports } from 'prompt-kit-ng';
import { PkMessageImports } from 'prompt-kit-ng';
import { PkScrollButton } from 'prompt-kit-ng';

@Component({
  selector: 'app-chat-container-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkChatContainerImports, PkMessageImports, PkScrollButton],
  template: `
    <h2 class="text-xl font-semibold mb-4">Chat Container + Scroll Button</h2>
    <button
      class="mb-3 rounded bg-primary text-primary-foreground px-3 py-1 text-sm"
      (click)="addMessage()"
    >
      Add message
    </button>
    <div class="relative max-w-2xl border rounded-lg" style="height: 400px;">
      <pk-chat-container-root class="h-full p-4 gap-3">
        <pk-chat-container-content class="gap-3">
          @for (m of messages(); track m.id) {
            <pk-message>
              <pk-message-avatar src="https://i.pravatar.cc/64?u={{ m.id }}" alt="U" fallback="U" />
              <pk-message-content [content]="m.text" />
            </pk-message>
          }
        </pk-chat-container-content>
        <pk-chat-container-scroll-anchor />
      </pk-chat-container-root>
      <div class="absolute bottom-4 right-4">
        <pk-scroll-button />
      </div>
    </div>
  `,
})
export class ChatContainerDemo {
  protected readonly messages = signal(
    Array.from({ length: 5 }, (_, i) => ({ id: i, text: `Message ${i + 1}` })),
  );
  protected addMessage(): void {
    const list = this.messages();
    this.messages.set([...list, { id: list.length, text: `Message ${list.length + 1}` }]);
  }
}
