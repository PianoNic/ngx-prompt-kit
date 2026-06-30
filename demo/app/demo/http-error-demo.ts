import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { describeHttpError } from 'ngx-prompt-kit/http-error';

const STATUSES = [0, 401, 403, 429, 503];

@Component({
  selector: 'app-http-error-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="HTTP Error"
      [original]="true"
      description="describeHttpError() maps any thrown value to a friendly, user-facing message — HttpErrorResponse by status, with RFC 7807 problem-details and raw-message fallbacks. Pass overrides to customise the copy per status."
    >
      <app-doc-example
        title="Status → message"
        description="The built-in defaults for the statuses chat apps care about. Each row is describeHttpError(new HttpErrorResponse({ status }))."
        [code]="usageCode"
      >
        <div class="flex w-full max-w-2xl flex-col gap-2" data-testid="http-rows">
          @for (row of rows; track row.status) {
            <div class="bg-muted/40 flex items-center gap-3 rounded-md border p-2 text-sm">
              <span
                class="text-foreground w-12 shrink-0 text-center font-mono"
                [attr.data-status]="row.status"
                >{{ row.status }}</span
              >
              <span class="text-muted-foreground" [attr.data-testid]="'msg-' + row.status">{{
                row.message
              }}</span>
            </div>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Per-status override"
        description="Pass an overrides object to replace any default. Here 402/403 becomes an upgrade prompt."
        [code]="overrideCode"
      >
        <div class="bg-muted/40 rounded-md border p-2 text-sm" data-testid="http-override">
          <span class="text-muted-foreground">{{ overrideMessage }}</span>
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Add the describeHttpError() utility to your project.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="installCmd" language="bash" />
          </pk-code-block>
        </div>
      </section>
    </app-doc-page>
  `,
})
export class HttpErrorDemo {
  protected readonly rows = STATUSES.map((status) => ({
    status,
    message: describeHttpError(new HttpErrorResponse({ status })),
  }));

  protected readonly overrideMessage = describeHttpError(new HttpErrorResponse({ status: 403 }), {
    forbidden: 'Upgrade your plan to use this model.',
  });

  protected readonly installCmd = 'ng generate ngx-prompt-kit:http-error';

  protected readonly usageCode = `import { describeHttpError } from 'ngx-prompt-kit/http-error';

catch (err) {
  this.error.set(describeHttpError(err));
}`;

  protected readonly overrideCode = `describeHttpError(err, {
  forbidden: 'Upgrade your plan to use this model.',
});`;
}
