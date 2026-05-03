import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmH4, HlmMuted } from '@spartan-ng/helm/typography';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';

@Component({
  selector: 'app-doc-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTabsImports, HlmH4, HlmMuted, PkCodeBlockImports],
  template: `
    <section>
      <h4 hlmH4 class="text-base">{{ title() }}</h4>
      @if (description(); as d) {
        <p hlmMuted class="mt-1 text-sm normal-case tracking-normal">{{ d }}</p>
      }
      <hlm-tabs tab="preview" class="mt-4">
        <hlm-tabs-list variant="line">
          <button hlmTabsTrigger="preview">Preview</button>
          @if (code()) {
            <button hlmTabsTrigger="code">Code</button>
          }
        </hlm-tabs-list>
        <div
          hlmTabsContent="preview"
          class="border-border bg-background mt-3 flex min-h-[200px] flex-col rounded-lg border p-6"
          [class.items-center]="centered()"
          [class.justify-center]="centered()"
        >
          <ng-content />
        </div>
        @if (code(); as src) {
          <div hlmTabsContent="code" class="mt-3">
            <pk-code-block>
              <pk-code-block-code [code]="src" [language]="language()" />
            </pk-code-block>
          </div>
        }
      </hlm-tabs>
    </section>
  `,
})
export class DocExample {
  public readonly title = input.required<string>();
  public readonly description = input<string | undefined>(undefined);
  public readonly centered = input<boolean>(false);
  public readonly code = input<string>('');
  public readonly language = input<string>('html');
}
