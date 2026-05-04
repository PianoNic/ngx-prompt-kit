// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../utils/cn';
import { PkConversationItem, type ConversationRename } from './pk-conversation-item';
import type {
  Conversation,
  ConversationGroup,
  ConversationGroupKey,
} from './pk-conversation-types';

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function bucketFor(updatedAt: Date | string, now: Date): ConversationGroupKey {
  const t = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
  const today = startOfDay(now);
  const stamp = startOfDay(t);
  const diff = today - stamp;
  if (diff <= 0) return 'today';
  if (diff === DAY) return 'yesterday';
  if (diff <= 7 * DAY) return 'last7';
  return 'older';
}

const GROUP_LABELS: Record<ConversationGroupKey, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7: 'Last 7 Days',
  older: 'Older',
};

const GROUP_ORDER: ConversationGroupKey[] = ['today', 'yesterday', 'last7', 'older'];

@Component({
  selector: 'pk-conversation-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkConversationItem],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    @if (groupBy() === 'date') {
      @for (group of groups(); track group.key) {
        <div class="flex flex-col gap-0.5">
          <p
            class="text-muted-foreground px-2 pt-3 pb-1 text-xs font-medium uppercase tracking-wider"
          >
            {{ group.label }}
          </p>
          @for (c of group.items; track c.id) {
            <pk-conversation-item
              [conversation]="c"
              [isActive]="c.id === activeId()"
              (selected)="selected.emit($event)"
              (renamed)="renamed.emit($event)"
              (deleted)="deleted.emit($event)"
            />
          }
        </div>
      }
    } @else {
      <div class="flex flex-col gap-0.5">
        @for (c of conversations(); track c.id) {
          <pk-conversation-item
            [conversation]="c"
            [isActive]="c.id === activeId()"
            (selected)="selected.emit($event)"
            (renamed)="renamed.emit($event)"
            (deleted)="deleted.emit($event)"
          />
        }
      </div>
    }
  `,
})
export class PkConversationList {
  public readonly conversations = input.required<readonly Conversation[]>();
  public readonly groupBy = input<'date' | 'none'>('date');
  public readonly activeId = input<string | null>(null);
  public readonly class = input<string>('');

  public readonly selected = output<string>();
  public readonly renamed = output<ConversationRename>();
  public readonly deleted = output<string>();

  protected readonly computedClass = computed(() =>
    cn('flex h-full flex-col gap-2 overflow-y-auto p-2', this.class()),
  );

  protected readonly groups = computed<ConversationGroup[]>(() => {
    const now = new Date();
    const buckets: Record<ConversationGroupKey, Conversation[]> = {
      today: [],
      yesterday: [],
      last7: [],
      older: [],
    };
    for (const c of this.conversations()) {
      buckets[bucketFor(c.updatedAt, now)].push(c);
    }
    const result: ConversationGroup[] = [];
    for (const key of GROUP_ORDER) {
      if (buckets[key].length > 0) {
        result.push({ key, label: GROUP_LABELS[key], items: buckets[key] });
      }
    }
    return result;
  });
}
