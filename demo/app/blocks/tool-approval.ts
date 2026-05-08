import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkApprovalImports } from 'ngx-prompt-kit/approval';
import { PkStepsImports } from 'ngx-prompt-kit/steps';
import { PkTool, type ToolPart } from 'ngx-prompt-kit/tool';

type Phase = 'awaiting-approval' | 'executing' | 'done' | 'rejected';

@Component({
  selector: 'app-block-tool-approval',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkApprovalImports, PkStepsImports, PkTool],
  template: `
    <app-block-page
      title="Tool call approval flow"
      description="The agent proposes a destructive action. The approval card gates execution. Once approved, the tool runs and a steps timeline narrates progress."
    >
      <app-doc-example title="Approve → execute → steps" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          @if (phase() === 'awaiting-approval') {
            <pk-approval
              title="Delete 12 stale branches"
              description="The assistant identified branches with no commits in the last 90 days and no open PRs. This action removes them from the remote."
              action="delete"
              severity="destructive"
              [parameters]="approvalParams"
              [pending]="pending()"
              approveLabel="Delete branches"
              (approved)="approve()"
              (rejected)="reject()"
            />
          }

          @if (phase() === 'rejected') {
            <pk-tool [toolPart]="rejectedTool" [defaultOpen]="true" />
          }

          @if (phase() === 'executing' || phase() === 'done') {
            <pk-tool [toolPart]="runningTool()" [defaultOpen]="true" />
            <pk-steps>
              <pk-steps-trigger>
                {{ phase() === 'done' ? 'Completed in 3 steps' : 'Running…' }}
              </pk-steps-trigger>
              <pk-steps-content>
                @for (step of completedSteps(); track step) {
                  <pk-steps-item>{{ step }}</pk-steps-item>
                }
              </pk-steps-content>
            </pk-steps>
          }

          <div class="text-muted-foreground flex items-center justify-end gap-2 text-xs">
            <span>Phase:</span>
            <span class="text-foreground font-mono">{{ phase() }}</span>
            <button
              class="text-foreground underline underline-offset-4"
              type="button"
              (click)="reset()"
            >
              reset
            </button>
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class ToolApprovalBlock {
  protected readonly phase = signal<Phase>('awaiting-approval');
  protected readonly pending = signal(false);
  protected readonly stepIndex = signal(0);

  protected readonly approvalParams = [
    { label: 'org', value: 'PianoNic' },
    { label: 'repo', value: 'ngx-prompt-kit' },
    { label: 'matched branches', value: '12' },
    { label: 'oldest', value: 'feature/old_thing (412 days)' },
  ];

  private readonly steps = [
    'Fetched branch list (148 total)',
    'Filtered by inactivity & no open PRs',
    'Deleted 12 branches via git push --delete',
  ];

  protected readonly completedSteps = computed(() =>
    this.steps.slice(0, this.stepIndex()),
  );

  protected readonly runningTool = computed<ToolPart>(() => ({
    type: 'cleanup_stale_branches',
    state: this.phase() === 'done' ? 'output-available' : 'input-streaming',
    input: { org: 'PianoNic', repo: 'ngx-prompt-kit', minAgeDays: 90 },
    output:
      this.phase() === 'done'
        ? {
            deleted: 12,
            branches: ['feature/old_thing', 'fix/legacy_auth', '…and 10 more'],
          }
        : undefined,
    toolCallId: 'call_a8c10f3e',
  }));

  protected readonly rejectedTool: ToolPart = {
    type: 'cleanup_stale_branches',
    state: 'output-error',
    input: { org: 'PianoNic', repo: 'ngx-prompt-kit', minAgeDays: 90 },
    errorText: 'User rejected the action.',
    toolCallId: 'call_a8c10f3e',
  };

  protected approve(): void {
    this.pending.set(true);
    setTimeout(() => {
      this.pending.set(false);
      this.phase.set('executing');
      this.runSteps();
    }, 700);
  }

  protected reject(): void {
    this.phase.set('rejected');
  }

  protected reset(): void {
    this.phase.set('awaiting-approval');
    this.stepIndex.set(0);
    this.pending.set(false);
  }

  private runSteps(): void {
    this.stepIndex.set(0);
    let i = 0;
    const tick = (): void => {
      if (i >= this.steps.length) {
        this.phase.set('done');
        return;
      }
      i++;
      this.stepIndex.set(i);
      setTimeout(tick, 600);
    };
    setTimeout(tick, 400);
  }

  protected readonly code = `// Three phases: awaiting-approval → executing → done
@if (phase() === 'awaiting-approval') {
  <pk-approval
    title="Delete 12 stale branches"
    action="delete"
    severity="destructive"
    [parameters]="approvalParams"
    [pending]="pending()"
    approveLabel="Delete branches"
    (approved)="approve()"
    (rejected)="reject()"
  />
}

@if (phase() === 'executing' || phase() === 'done') {
  <pk-tool [toolPart]="runningTool()" [defaultOpen]="true" />
  <pk-steps>
    <pk-steps-trigger>
      {{ phase() === 'done' ? 'Completed in 3 steps' : 'Running…' }}
    </pk-steps-trigger>
    <pk-steps-content>
      @for (step of completedSteps(); track step) {
        <pk-steps-item>{{ step }}</pk-steps-item>
      }
    </pk-steps-content>
  </pk-steps>
}

// Component
protected readonly phase = signal<Phase>('awaiting-approval');
protected readonly stepIndex = signal(0);
protected readonly completedSteps = computed(() =>
  this.steps.slice(0, this.stepIndex())
);
protected readonly runningTool = computed<ToolPart>(() => ({
  type: 'cleanup_stale_branches',
  state: this.phase() === 'done' ? 'output-available' : 'input-streaming',
  input: { /* ... */ },
  output: this.phase() === 'done' ? { deleted: 12 } : undefined,
}));

protected approve(): void {
  this.pending.set(true);
  setTimeout(() => {
    this.pending.set(false);
    this.phase.set('executing');
    this.runSteps();
  }, 700);
}`;
}
