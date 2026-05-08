import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { PkMessageImports } from 'ngx-prompt-kit/message';

const BEFORE = `function refreshSession(token: string) {
  if (!token) throw new Error('no token');
  const decoded = verifyToken(token);
  if (decoded.expired) {
    return refreshSession(decoded.refreshToken);
  }
  return decoded;
}`;

const AFTER = `// session/refresh.ts — extracted to break the cycle
function refreshSession(token: string) {
  const decoded = decodeToken(token);
  if (decoded.expired) {
    return exchangeRefreshToken(decoded.refreshToken);
  }
  return decoded;
}`;

@Component({
  selector: 'app-block-code-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkCodeBlockImports, PkMessageImports],
  template: `
    <app-block-page
      title="Code review thread"
      description="A code review pattern: paste in code, the assistant returns a critique with markdown commentary and a side-by-side before/after."
    >
      <app-doc-example title="Snippet → review with diff" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <pk-message class="justify-end">
            <div class="flex max-w-full min-w-0 flex-col gap-2">
              <pk-message-content
                class="bg-primary text-primary-foreground"
                content="Review this — it's stuck in a recursion loop."
              />
              <pk-code-block class="overflow-hidden">
                <pk-code-block-group
                  class="border-border text-muted-foreground border-b px-3 py-1.5 text-[11px]"
                >
                  <span class="font-mono">session.ts (before)</span>
                  <span class="uppercase tracking-wider">typescript</span>
                </pk-code-block-group>
                <pk-code-block-code [code]="before" language="ts" />
              </pk-code-block>
            </div>
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <div class="flex min-w-0 flex-1 flex-col gap-3">
              <pk-message-content
                [markdown]="true"
                content="The cycle is the recursive call — \`refreshSession\` calls itself with the refresh token, which goes back through \`verifyToken\`. **Fix:** decode without verifying, then exchange the refresh token via a separate code path."
              />
              <pk-code-block class="overflow-hidden">
                <pk-code-block-group
                  class="border-border text-muted-foreground border-b px-3 py-1.5 text-[11px]"
                >
                  <span class="font-mono">session/refresh.ts (after)</span>
                  <span class="text-primary uppercase tracking-wider">suggested</span>
                </pk-code-block-group>
                <pk-code-block-code [code]="after" language="ts" />
              </pk-code-block>
            </div>
          </pk-message>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class CodeReviewBlock {
  protected readonly before = BEFORE;
  protected readonly after = AFTER;

  protected readonly code = `<!-- User message: prose + the snippet inside one bubble -->
<pk-message class="justify-end">
  <div class="flex flex-col gap-2 max-w-full min-w-0">
    <pk-message-content
      class="bg-primary text-primary-foreground"
      content="Review this — it's stuck in a recursion loop."
    />
    <pk-code-block>
      <pk-code-block-group class="border-b px-3 py-1.5 text-[11px]">
        <span class="font-mono">session.ts (before)</span>
        <span class="uppercase tracking-wider">typescript</span>
      </pk-code-block-group>
      <pk-code-block-code [code]="before" language="ts" />
    </pk-code-block>
  </div>
</pk-message>

<!-- Assistant: markdown commentary + suggested fix -->
<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <div class="flex flex-1 flex-col gap-3">
    <pk-message-content
      [markdown]="true"
      content="The cycle is the recursive call — **fix:** decode without verifying, then exchange via a separate code path."
    />
    <pk-code-block>
      <pk-code-block-group class="border-b px-3 py-1.5 text-[11px]">
        <span class="font-mono">session/refresh.ts (after)</span>
        <span class="text-primary uppercase">suggested</span>
      </pk-code-block-group>
      <pk-code-block-code [code]="after" language="ts" />
    </pk-code-block>
  </div>
</pk-message>`;
}
