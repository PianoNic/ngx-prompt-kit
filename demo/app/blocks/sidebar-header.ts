import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkConversationListImports, type Conversation } from 'ngx-prompt-kit/conversation-list';
import { PkModelPickerImports, type Model } from 'ngx-prompt-kit/model-picker';
import { PkUsageCardImports } from 'ngx-prompt-kit/usage-card';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();

const AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

@Component({
  selector: 'app-block-sidebar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    PkConversationListImports,
    PkModelPickerImports,
    PkUsageCardImports,
  ],
  template: `
    <app-block-page
      title="Sidebar header"
      description="Persistent left rail. Top: model picker for the current chat. Middle: scrollable conversation list. Bottom: usage card with the user's identity and budget."
    >
      <app-doc-example title="Model picker · conversations · usage" [code]="code">
        <div class="flex w-full justify-center">
          <div
            class="border-border bg-background flex h-[600px] w-72 flex-col overflow-hidden rounded-lg border"
          >
            <div class="border-border flex flex-col gap-2 border-b p-3">
              <span class="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                Model
              </span>
              <pk-model-picker
                [compact]="true"
                [models]="models"
                [(selectedId)]="selectedModelId"
              />
            </div>

            <div class="flex-1 overflow-hidden">
              <pk-conversation-list
                [conversations]="conversations()"
                [activeId]="activeId()"
                (selected)="activeId.set($event)"
              />
            </div>

            <div class="border-border border-t p-3">
              <pk-usage-card
                display="inline"
                [used]="42_000"
                [limit]="50_000"
                [avatar]="avatar"
                name="Niclas"
                sublabel="Pro · resets in 12 days"
              />
            </div>
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class SidebarHeaderBlock {
  protected readonly avatar = AVATAR;

  protected readonly models: Model[] = [
    { id: 'fast', name: 'Quill Fast', provider: 'Acme', tier: 'fast' },
    { id: 'balanced', name: 'Quill Balanced', provider: 'Acme', tier: 'balanced' },
    { id: 'smart', name: 'Quill Reason', provider: 'Acme', tier: 'smart' },
  ];
  protected readonly selectedModelId = signal<string | null>('balanced');

  protected readonly conversations = signal<Conversation[]>([
    {
      id: '1',
      title: 'Release notes from commit log',
      preview: 'Group commits into features, fixes, chores',
      updatedAt: new Date(NOW - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Signal vs computed primer',
      updatedAt: new Date(NOW - 8 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Migration plan for auth middleware',
      updatedAt: new Date(NOW - 1 * DAY),
    },
    {
      id: '4',
      title: 'Tailwind v4 upgrade gotchas',
      updatedAt: new Date(NOW - 3 * DAY),
    },
    {
      id: '5',
      title: 'OIDC trusted publisher setup',
      updatedAt: new Date(NOW - 6 * DAY),
    },
  ]);

  protected readonly activeId = signal<string | null>('1');

  protected readonly code = `<aside class="flex h-screen w-72 flex-col border-r">
  <div class="border-b p-3">
    <pk-model-picker
      [compact]="true"
      [models]="models"
      [(selectedId)]="selectedModelId"
    />
  </div>

  <div class="flex-1 overflow-hidden">
    <pk-conversation-list
      [conversations]="conversations()"
      [activeId]="activeId()"
      (selected)="activeId.set($event)"
    />
  </div>

  <div class="border-t p-3">
    <pk-usage-card
      display="inline"
      [used]="42_000"
      [limit]="50_000"
      [avatar]="avatarUrl"
      name="Niclas"
      sublabel="Pro · resets in 12 days"
    />
  </div>
</aside>`;
}
