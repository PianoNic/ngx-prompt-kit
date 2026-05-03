import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'prompt-kit-ng/message';

@Component({
  selector: 'app-message-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, HlmButton, HlmIconImports, PkMessageImports],
  providers: [provideIcons({ lucideCopy, lucideThumbsUp, lucideThumbsDown })],
  template: `
    <app-doc-page
      title="Message"
      description="A row in a chat thread. Pairs an avatar with content; supports plain text or markdown, plus a row of inline actions."
    >
      <!-- Basic conversation -->
      <app-doc-example
        title="Basic conversation"
        description="A back-and-forth exchange. User messages align right, assistant messages align left with an avatar."
        [code]="basicCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Could you summarize the latest commit log into release notes?"
            />
          </pk-message>
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="I can help with that — pull the commit range and I'll group them into features, fixes, and chores."
            />
          </pk-message>
        </div>
      </app-doc-example>

      <!-- With markdown -->
      <app-doc-example
        title="With markdown"
        description="Set [markdown]=true on the content to render headings, lists, code, and emphasis."
        [code]="markdownCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Give me the v0.1.0 changelog as markdown."
            />
          </pk-message>
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              [markdown]="true"
              content="**v0.1.0**

- Refactored the auth middleware
- Added \`session.refresh()\` helper
- Fixed an off-by-one in pagination

Want me to group by author next time?"
            />
          </pk-message>
        </div>
      </app-doc-example>

      <!-- With actions -->
      <app-doc-example
        title="With actions"
        description="MessageActions and MessageAction add interactive controls below an assistant message — copy, regenerate, thumbs up/down."
        [code]="actionsCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Explain the difference between signal() and computed()."
            />
          </pk-message>
          <div class="flex flex-col gap-1">
            <pk-message>
              <pk-message-avatar src="" alt="Assistant" fallback="AI" />
              <pk-message-content
                content="signal() holds writable state. computed() derives a read-only value from one or more signals; it re-evaluates lazily when its dependencies change."
              />
            </pk-message>
            <pk-message-actions class="ml-11">
              <pk-message-action tooltip="Copy">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Copy">
                  <ng-icon hlm size="xs" name="lucideCopy" />
                </button>
              </pk-message-action>
              <pk-message-action tooltip="Good response">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Thumbs up">
                  <ng-icon hlm size="xs" name="lucideThumbsUp" />
                </button>
              </pk-message-action>
              <pk-message-action tooltip="Bad response">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Thumbs down">
                  <ng-icon hlm size="xs" name="lucideThumbsDown" />
                </button>
              </pk-message-action>
            </pk-message-actions>
          </div>
        </div>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class MessageDemo {
  protected readonly basicCode = `<pk-message class="justify-end">
  <pk-message-content
    class="bg-primary text-primary-foreground"
    content="Could you summarize the latest commit log into release notes?"
  />
</pk-message>

<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content
    content="I can help with that — pull the commit range and I'll group them..."
  />
</pk-message>`;

  protected readonly markdownCode = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content
    [markdown]="true"
    content="**v0.1.0**

- Refactored the auth middleware
- Added \\\`session.refresh()\\\` helper"
  />
</pk-message>`;

  protected readonly actionsCode = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content content="signal() holds writable state..." />
</pk-message>

<pk-message-actions class="ml-11">
  <pk-message-action tooltip="Copy">
    <button hlmBtn variant="ghost" size="icon-sm">
      <svg>...</svg>
    </button>
  </pk-message-action>
  <pk-message-action tooltip="Good response">...</pk-message-action>
  <pk-message-action tooltip="Bad response">...</pk-message-action>
</pk-message-actions>`;
}
