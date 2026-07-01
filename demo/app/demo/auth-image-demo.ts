import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { PkAuthImageImports } from 'ngx-prompt-kit/auth-image';

@Component({
  selector: 'app-auth-image-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkCodeBlockImports, PkAuthImageImports],
  template: `
    <app-doc-page
      title="Auth Image"
      [original]="true"
      description="pk-auth-image fetches an image via HttpClient (so your auth interceptor attaches the token), shows the blob as an object URL, and revokes it on change/destroy. Skeleton while loading; a fallback (project [error] content) on failure."
    >
      <app-doc-example
        title="Loads via HttpClient"
        description="Here it fetches a same-origin asset. In your app, point [url] at a token-protected endpoint — the auth interceptor adds the header automatically."
        [code]="usageCode"
      >
        <div class="flex items-end gap-6" data-testid="auth-image-demo">
          <div class="flex flex-col items-center gap-2">
            <pk-auth-image
              url="/icon.svg"
              alt="ngx-prompt-kit icon"
              class="border-border h-20 w-20 rounded-md border"
              data-testid="auth-image-ok"
            />
            <span class="text-muted-foreground text-xs">Loaded</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <pk-auth-image
              url="http://127.0.0.1:1/missing.png"
              alt="missing"
              class="border-border h-20 w-20 rounded-md border"
              data-testid="auth-image-error"
            >
              <span error>Not found</span>
            </pk-auth-image>
            <span class="text-muted-foreground text-xs">Error fallback</span>
          </div>
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Add the auth-image component. Requires
          <code class="font-mono text-xs">provideHttpClient()</code>.
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
export class AuthImageDemo {
  protected readonly installCmd = 'ng generate ngx-prompt-kit:auth-image';

  protected readonly usageCode = `<pk-auth-image
  [url]="'/api/attachment/' + id"
  alt="Attachment"
  class="h-24 w-24 rounded-md"
>
  <span error>Couldn't load</span>
</pk-auth-image>`;
}
