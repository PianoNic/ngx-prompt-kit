import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkBranchNavImports } from 'ngx-prompt-kit/branch-nav';

@Component({
  selector: 'app-branch-nav-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkMessageImports, PkBranchNavImports],
  template: `
    <app-doc-page
      title="Branch Nav"
      [original]="true"
      description="Sibling-message version navigation. Renders a 1-indexed counter flanked by prev/next arrows. The component does not own the branch state — consumer manages which branch is current and listens for (changed)."
    >
      <app-doc-example
        title="Compact"
        description="Set [compact]='true' for the '1 / 3' format. Arrows disable at edges; Left/Right keys navigate when the component has focus."
        [code]="compactCode"
      >
        <div class="flex w-full flex-col items-center gap-3">
          <pk-branch-nav
            [current]="compactCurrent()"
            [total]="5"
            [compact]="true"
            (changed)="compactCurrent.set($event)"
          />
          <p class="text-muted-foreground text-xs">
            Current branch: <span class="text-foreground font-mono">{{ compactCurrent() }}</span>
          </p>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Verbose, below an assistant message"
        description="Default verbose format reads naturally as a caption. Wire (changed) to swap which sibling content shows in the bubble above."
        [code]="verboseCode"
      >
        <div class="flex w-full flex-col gap-1">
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content [content]="branchedContent()" />
          </pk-message>
          <div class="ml-11">
            <pk-branch-nav
              [current]="verboseCurrent()"
              [total]="branches.length"
              (changed)="verboseCurrent.set($event)"
            />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Single branch — renders nothing"
        description="When [total]='1' the component renders nothing — there's no point in branch nav for a single sibling. The 'no value to render' surface area below shows the example container's natural padding."
        [code]="singleCode"
      >
        <div class="flex w-full flex-col items-center gap-2">
          <pk-branch-nav [current]="1" [total]="1" />
          <p class="text-muted-foreground text-xs italic">
            (component intentionally renders nothing)
          </p>
        </div>
      </app-doc-example>

      <app-doc-install component="branch-nav" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class BranchNavDemo {
  protected readonly compactCurrent = signal(2);
  protected readonly verboseCurrent = signal(1);

  protected readonly branches = [
    'Tailwind v4 introduced a CSS-first configuration model — most theme customisation now lives in your stylesheet via the @theme directive.',
    'Spartan UI ships its components as headless primitives plus pre-styled "helm" wrappers, so you can swap styling without rewriting behaviour.',
    'Angular signals replaced the older RxJS-heavy patterns for component state — input(), output(), and computed() handle most of what BehaviorSubject used to.',
  ];

  protected readonly branchedContent = computed(
    () => this.branches[this.verboseCurrent() - 1] ?? this.branches[0],
  );

  protected readonly api: ApiSection[] = [
    {
      name: 'PkBranchNav',
      props: [
        { name: 'current', type: 'number', description: '1-indexed current branch (required).' },
        {
          name: 'total',
          type: 'number',
          description: 'Total branch count. Component renders nothing when total ≤ 1.',
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description: 'Renders "1 / 3" instead of "Branch 1 of 3".',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'changed',
          type: '(next: number) => void',
          description:
            'Fires when the user navigates. 1-indexed. Consumer updates current to reflect.',
        },
      ],
    },
  ];

  protected readonly compactCode = `<pk-branch-nav
  [current]="current()"
  [total]="5"
  compact
  (changed)="current.set($event)"
/>`;

  protected readonly verboseCode = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content [content]="branchContent()" />
</pk-message>
<pk-branch-nav
  class="ml-11"
  [current]="current()"
  [total]="branches.length"
  (changed)="current.set($event)"
/>`;

  protected readonly singleCode = `<pk-branch-nav [current]="1" [total]="1" />
<!-- renders nothing -->`;
}
