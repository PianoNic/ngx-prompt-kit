import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import {
  PkConversationListImports,
  type Conversation,
  type ConversationRename,
} from 'ngx-prompt-kit/conversation-list';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

@Component({
  selector: 'app-conversation-list-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkConversationListImports],
  template: `
    <app-doc-page
      title="Conversation List"
      [original]="true"
      description="Sidebar of past conversations. Optional date grouping (Today / Yesterday / Last 7 Days / Older), inline rename, and a hover-revealed actions menu."
    >
      <app-doc-example
        title="Grouped by date"
        description="Default mode. Empty buckets are not rendered. Hover or focus a row to reveal the actions menu."
        [code]="groupedCode"
      >
        <div class="border-border bg-background h-[420px] w-full max-w-xs rounded-lg border">
          <pk-conversation-list
            [conversations]="grouped()"
            [activeId]="activeId()"
            (selected)="activeId.set($event)"
            (renamed)="onRename($event)"
            (deleted)="onDelete($event)"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Flat list"
        description="Set [groupBy]='none' to render conversations in their original order without date headers."
        [code]="flatCode"
      >
        <div class="border-border bg-background h-[320px] w-full max-w-xs rounded-lg border">
          <pk-conversation-list
            groupBy="none"
            [conversations]="flat()"
            [activeId]="flatActiveId()"
            (selected)="flatActiveId.set($event)"
          />
        </div>
      </app-doc-example>

      <app-doc-install component="conversation-list" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ConversationListDemo {
  protected readonly grouped = signal<Conversation[]>([
    {
      id: '1',
      title: 'Release notes from commit log',
      preview: 'Group commits into features, fixes, chores',
      updatedAt: new Date(now - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Signal vs computed primer',
      preview: 'Writable state vs derived read-only values',
      updatedAt: new Date(now - 8 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Migration plan for auth middleware',
      updatedAt: new Date(now - 1 * DAY),
    },
    {
      id: '4',
      title: 'Tailwind v4 upgrade gotchas',
      preview: '@theme directive replaces tailwind.config.js',
      updatedAt: new Date(now - 3 * DAY),
    },
    {
      id: '5',
      title: 'OIDC trusted publisher setup',
      updatedAt: new Date(now - 6 * DAY),
    },
    {
      id: '6',
      title: 'Old draft from last month',
      updatedAt: new Date(now - 30 * DAY),
    },
  ]);

  protected readonly activeId = signal<string | null>('1');

  protected readonly flat = signal<Conversation[]>([
    { id: 'a', title: 'Pinned: roadmap', updatedAt: new Date(now - 5 * DAY) },
    { id: 'b', title: 'Untitled draft', updatedAt: new Date(now - 1 * DAY) },
    { id: 'c', title: 'Bug triage notes', updatedAt: new Date(now - 4 * 60 * 60 * 1000) },
  ]);
  protected readonly flatActiveId = signal<string | null>('b');

  protected onRename({ id, title }: ConversationRename): void {
    this.grouped.update((list) =>
      list.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date() } : c)),
    );
  }

  protected onDelete(id: string): void {
    this.grouped.update((list) => list.filter((c) => c.id !== id));
    if (this.activeId() === id) this.activeId.set(null);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkConversationList',
      props: [
        {
          name: 'conversations',
          type: 'readonly Conversation[]',
          description: 'The conversations to render (required).',
        },
        {
          name: 'groupBy',
          type: '"date" | "none"',
          default: '"date"',
          description: 'Bucket items by Today / Yesterday / Last 7 Days / Older, or render flat.',
        },
        {
          name: 'activeId',
          type: 'string | null',
          default: 'null',
          description: 'The id of the currently selected conversation.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'PkConversationItem',
      props: [
        { name: 'conversation', type: 'Conversation', description: 'The conversation to render (required).' },
        { name: 'isActive', type: 'boolean', default: 'false', description: 'Highlight as the active row.' },
        { name: 'class', type: 'string', description: 'Extra classes for the row.' },
      ],
    },
    {
      name: 'Outputs (both)',
      props: [
        { name: 'selected', type: '(id: string) => void', description: 'Fires when a row is clicked.' },
        {
          name: 'renamed',
          type: '({ id, title }) => void',
          description: 'Fires after the inline rename input commits a non-empty, changed value.',
        },
        { name: 'deleted', type: '(id: string) => void', description: 'Fires when the Delete action is chosen.' },
      ],
    },
  ];

  protected readonly groupedCode = `<pk-conversation-list
  [conversations]="conversations()"
  [activeId]="activeId()"
  (selected)="activeId.set($event)"
  (renamed)="onRename($event)"
  (deleted)="onDelete($event)"
/>`;

  protected readonly flatCode = `<pk-conversation-list
  groupBy="none"
  [conversations]="conversations()"
  [activeId]="activeId()"
  (selected)="activeId.set($event)"
/>`;
}
