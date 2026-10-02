import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideInfo, lucidePlus, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';

interface Notice {
  id: number;
  text: string;
  variant: 'action' | 'error' | 'warning';
}

@Component({
  selector: 'app-block-notification-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, HlmAlertImports, HlmButton, NgIcon],
  providers: [provideIcons({ lucideCircleAlert, lucideInfo, lucidePlus, lucideTriangleAlert })],
  template: `
    <app-block-page
      title="Notification stack"
      description="A toast/notification centre composed of stacked spartan alerts. Click Add to push a new notice; close any to dismiss it."
    >
      <app-doc-example title="Add · dismiss · variant mix" [code]="code">
        <div class="flex w-full max-w-md flex-col gap-3">
          <div class="flex justify-end">
            <button hlmBtn variant="outline" size="sm" type="button" (click)="add()">
              <ng-icon name="lucidePlus" class="text-[length:--spacing(3)]" />
              Add notice
            </button>
          </div>

          <div class="flex flex-col gap-2">
            @for (n of notices(); track n.id) {
              <div
                hlmAlert
                [variant]="n.variant === 'error' ? 'destructive' : 'default'"
                [class]="n.variant === 'warning' ? 'text-amber-700 dark:text-amber-500' : ''"
              >
                <ng-icon [name]="icons[n.variant]" />
                <p hlmAlertDescription class="text-current">{{ n.text }}</p>
                <div hlmAlertAction>
                  <button hlmBtn variant="outline" size="xs" type="button" (click)="dismiss(n.id)">
                    Dismiss
                  </button>
                </div>
              </div>
            }

            @if (notices().length === 0) {
              <p class="text-muted-foreground text-center text-xs italic">No notices</p>
            }
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class NotificationStackBlock {
  protected readonly icons: Record<Notice['variant'], string> = {
    action: 'lucideInfo',
    warning: 'lucideTriangleAlert',
    error: 'lucideCircleAlert',
  };

  private readonly templates: Omit<Notice, 'id'>[] = [
    { text: 'Connected to model gpt-5.', variant: 'action' },
    { text: 'Rate limit hit — backing off for 30s.', variant: 'warning' },
    { text: 'Tool call timed out after 60s.', variant: 'error' },
    { text: 'Saved chat to your history.', variant: 'action' },
    { text: 'New version available — refresh to update.', variant: 'warning' },
  ];

  private nextId = 1;
  protected readonly notices = signal<Notice[]>([
    { id: 0, text: 'Connected to model gpt-5.', variant: 'action' },
    { id: -1, text: 'Tool call timed out after 60s.', variant: 'error' },
  ]);

  protected add(): void {
    const tpl = this.templates[Math.floor(Math.random() * this.templates.length)];
    const id = this.nextId++;
    this.notices.update((list) => [{ id, ...tpl }, ...list]);
  }

  protected dismiss(id: number): void {
    this.notices.update((list) => list.filter((n) => n.id !== id));
  }

  protected readonly code = `<div class="flex flex-col gap-2">
  @for (n of notices(); track n.id) {
    <div
      hlmAlert
      [variant]="n.variant === 'error' ? 'destructive' : 'default'"
      [class]="n.variant === 'warning' ? 'text-amber-700 dark:text-amber-500' : ''"
    >
      <ng-icon [name]="icons[n.variant]" />
      <p hlmAlertDescription class="text-current">{{ n.text }}</p>
      <div hlmAlertAction>
        <button hlmBtn variant="outline" size="xs" (click)="dismiss(n.id)">Dismiss</button>
      </div>
    </div>
  }
</div>

// Component
interface Notice {
  id: number;
  text: string;
  variant: 'action' | 'error' | 'warning';
}

protected readonly icons: Record<Notice['variant'], string> = {
  action: 'lucideInfo',
  warning: 'lucideTriangleAlert',
  error: 'lucideCircleAlert',
};
protected readonly notices = signal<Notice[]>([]);
private nextId = 1;

protected add(template: Omit<Notice, 'id'>): void {
  this.notices.update(list => [{ id: this.nextId++, ...template }, ...list]);
}

protected dismiss(id: number): void {
  this.notices.update(list => list.filter(n => n.id !== id));
}`;
}
