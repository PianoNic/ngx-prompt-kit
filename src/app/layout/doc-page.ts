import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmH1, HlmLead, HlmMuted } from '@spartan-ng/helm/typography';
import { DocNav } from './doc-nav';

@Component({
  selector: 'app-doc-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmH1, HlmLead, HlmMuted, DocNav],
  template: `
    <article class="mx-auto max-w-3xl">
      <header class="mb-10">
        <h1 hlmH1 class="text-3xl lg:text-4xl">{{ title() }}</h1>
        @if (original()) {
          <p class="text-muted-foreground mt-2 text-xs italic">
            ngx-prompt-kit original — not part of ibelick/prompt-kit
          </p>
        }
        @if (description(); as d) {
          <p hlmLead class="mt-2 text-base">{{ d }}</p>
        }
      </header>
      <p hlmMuted class="mb-6 uppercase tracking-wider">Examples</p>
      <div class="flex flex-col gap-12">
        <ng-content />
      </div>
      <app-doc-nav />
    </article>
  `,
})
export class DocPage {
  public readonly title = input.required<string>();
  public readonly description = input<string | undefined>(undefined);
  public readonly original = input<boolean>(false);
}
