import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileSearch, lucideHammer, lucideRefreshCw, lucideSquare } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChainOfThoughtImports } from 'ngx-prompt-kit/chain-of-thought';
import { PkTool, type ToolPart } from 'ngx-prompt-kit/tool';

interface PhaseEntry {
  trigger: string;
  iconName: string;
  detail: string;
}

@Component({
  selector: 'app-block-agent-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, HlmButton, NgIcon, PkChainOfThoughtImports, PkTool],
  providers: [provideIcons({ lucideFileSearch, lucideHammer, lucideRefreshCw, lucideSquare })],
  template: `
    <app-block-page
      title="Long-running agent task"
      description="An autonomous task that takes a while: a shimmering status line at the top while it works, narrated steps in a chain-of-thought, and a tool call that updates as it executes. A Stop / Regenerate button lets you abort or restart."
    >
      <app-doc-example title="Live agent run" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          @if (state() === 'streaming') {
            <div class="flex w-full items-center justify-between max-w-md">
              <span role="status" class="shimmer text-muted-foreground text-sm font-medium">{{
                currentTrigger()
              }}</span>
              <button
                hlmBtn
                variant="link"
                size="sm"
                type="button"
                class="text-muted-foreground"
                (click)="stop()"
              >
                Stop
              </button>
            </div>
          }

          @if (visiblePhases().length > 0) {
            <pk-chain-of-thought class="max-w-xl">
              @for (p of visiblePhases(); track p.trigger; let isLast = $last) {
                <pk-chain-of-thought-step [last]="isLast && state() !== 'streaming'">
                  <pk-chain-of-thought-trigger [leftIcon]="true">
                    <ng-icon leftIcon [name]="p.iconName" class="text-[length:--spacing(3)]" />
                    {{ p.trigger }}
                  </pk-chain-of-thought-trigger>
                  <pk-chain-of-thought-content>
                    <pk-chain-of-thought-item>{{ p.detail }}</pk-chain-of-thought-item>
                  </pk-chain-of-thought-content>
                </pk-chain-of-thought-step>
              }
            </pk-chain-of-thought>
          }

          <pk-tool [toolPart]="currentTool()" [defaultOpen]="true" />

          <div class="flex justify-end">
            @if (state() === 'streaming') {
              <button hlmBtn variant="secondary" size="sm" type="button" (click)="stop()">
                <ng-icon name="lucideSquare" />
                Stop
              </button>
            } @else {
              <button hlmBtn variant="ghost" size="sm" type="button" (click)="start()">
                <ng-icon name="lucideRefreshCw" />
                Regenerate
              </button>
            }
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class AgentTaskBlock {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected readonly state = signal<'idle' | 'streaming'>('idle');
  protected readonly phaseIdx = signal(0);

  private readonly phases: PhaseEntry[] = [
    {
      trigger: 'Scanning the repo for stale branches',
      iconName: 'lucideFileSearch',
      detail: 'Walked 148 branches; 12 had no commits in the last 90 days and no open PRs.',
    },
    {
      trigger: 'Building the deletion plan',
      iconName: 'lucideHammer',
      detail:
        'Filtered against tag references and protected-branch rules. Final candidate set: 12.',
    },
    {
      trigger: 'Pushing branch deletions',
      iconName: 'lucideRefreshCw',
      detail: 'Issued 12 deletion ops in batches of 4 to stay under the API rate limit.',
    },
  ];

  protected readonly visiblePhases = computed(() => this.phases.slice(0, this.phaseIdx()));

  protected readonly currentTrigger = computed(
    () => this.phases[this.phaseIdx()]?.trigger ?? 'Working…',
  );

  protected readonly currentTool = computed<ToolPart>(() => {
    const done = this.state() === 'idle' && this.phaseIdx() === this.phases.length;
    return {
      type: 'cleanup_stale_branches',
      state: done ? 'output-available' : 'input-streaming',
      input: { org: 'PianoNic', repo: 'ngx-prompt-kit', minAgeDays: 90 },
      output: done ? { deleted: 12, durationMs: 4_120 } : undefined,
      toolCallId: 'call_a8c10f3e',
    };
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
    if (this.isBrowser) {
      this.timer = setTimeout(() => this.start(), 200);
    }
  }

  protected start(): void {
    if (!this.isBrowser) return;
    this.phaseIdx.set(0);
    this.state.set('streaming');
    this.advance();
  }

  private advance(): void {
    if (this.state() !== 'streaming') return;
    if (this.phaseIdx() >= this.phases.length) {
      this.state.set('idle');
      return;
    }
    this.phaseIdx.update((v) => v + 1);
    this.timer = setTimeout(() => this.advance(), 1100);
  }

  protected stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.state.set('idle');
  }

  protected readonly code = `@if (state() === 'streaming') {
  <div class="flex w-full items-center justify-between">
    <span role="status" class="shimmer text-muted-foreground text-sm font-medium">{{ currentTrigger() }}</span>
    <button
      hlmBtn
      variant="link"
      size="sm"
      type="button"
      class="text-muted-foreground"
      (click)="stop()"
    >
      Stop
    </button>
  </div>
}

<pk-chain-of-thought>
  @for (p of visiblePhases(); track p.trigger; let isLast = $last) {
    <pk-chain-of-thought-step [last]="isLast && state() !== 'streaming'">
      <pk-chain-of-thought-trigger [leftIcon]="true">
        <ng-icon leftIcon [name]="p.iconName" class="text-[length:--spacing(3)]" />
        {{ p.trigger }}
      </pk-chain-of-thought-trigger>
      <pk-chain-of-thought-content>
        <pk-chain-of-thought-item>{{ p.detail }}</pk-chain-of-thought-item>
      </pk-chain-of-thought-content>
    </pk-chain-of-thought-step>
  }
</pk-chain-of-thought>

<pk-tool [toolPart]="currentTool()" [defaultOpen]="true" />

@if (state() === 'streaming') {
  <button hlmBtn variant="secondary" size="sm" type="button" (click)="stop()">
    <ng-icon name="lucideSquare" />
    Stop
  </button>
} @else {
  <button hlmBtn variant="ghost" size="sm" type="button" (click)="start()">
    <ng-icon name="lucideRefreshCw" />
    Regenerate
  </button>
}

// Component
private readonly phases = [
  { trigger: 'Scanning the repo...', iconName: 'lucideFileSearch', detail: '...' },
  { trigger: 'Building the plan',    iconName: 'lucideHammer',     detail: '...' },
  { trigger: 'Pushing deletions',    iconName: 'lucideRefreshCw',  detail: '...' },
];
protected readonly state = signal<'idle' | 'streaming'>('idle');
protected readonly phaseIdx = signal(0);
protected readonly visiblePhases = computed(() =>
  this.phases.slice(0, this.phaseIdx())
);
protected readonly currentTrigger = computed(
  () => this.phases[this.phaseIdx()]?.trigger ?? 'Working…'
);
protected readonly currentTool = computed<ToolPart>(() => ({
  type: 'cleanup_stale_branches',
  state: this.state() === 'idle' ? 'output-available' : 'input-streaming',
  // ...
}));`;
}
