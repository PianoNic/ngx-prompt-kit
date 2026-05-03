import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PkMessageImports } from 'prompt-kit-ng/message';

@Component({
  selector: 'app-message-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMessageImports],
  template: `
    <h2 class="text-xl font-semibold mb-4">Message</h2>
    <pk-message class="max-w-xl">
      <pk-message-avatar src="https://i.pravatar.cc/64?u=1" alt="User" fallback="U" />
      <pk-message-content content="Hello! This is a plain text message inside pk-message-content." />
    </pk-message>

    <pk-message class="max-w-xl mt-4">
      <pk-message-avatar src="https://i.pravatar.cc/64?u=2" alt="Bot" fallback="AI" />
      <pk-message-content
        [markdown]="true"
        content="**Markdown** message with \`inline code\` and a list:
- One
- Two
- Three"
      />
    </pk-message>
  `,
})
export class MessageDemo {}
