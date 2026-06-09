import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkPromptSuggestion } from 'ngx-prompt-kit/prompt-suggestion';

interface Variant {
  id: string;
  label: string;
  text: string;
}

@Component({
  selector: 'app-block-regenerate-variants',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmIconImports,
    PkMessageImports,
    PkPromptSuggestion,
  ],
  providers: [provideIcons({ lucideRefreshCw })],
  template: `
    <app-block-page
      title="Regenerate variants"
      description="Mid-conversation 'try a different angle' affordance. Pick a tone via prompt-suggestion chips; the assistant message swaps to that variant."
    >
      <app-doc-example title="Tone presets · live message swap" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Explain why semantic versioning matters."
            />
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <div class="flex min-w-0 flex-1 flex-col gap-3">
              <pk-message-content [markdown]="true" [content]="current().text" />

              <div class="border-border flex flex-col gap-2 border-t pt-3">
                <span
                  class="text-muted-foreground inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider"
                >
                  <ng-icon hlm size="xs" name="lucideRefreshCw" />
                  Try a different tone
                </span>
                <div class="flex flex-wrap gap-2">
                  @for (v of variants; track v.id) {
                    <pk-prompt-suggestion
                      [content]="v.label"
                      [variant]="v.id === currentId() ? 'default' : 'outline'"
                      (clicked)="currentId.set(v.id)"
                    />
                  }
                </div>
              </div>
            </div>
          </pk-message>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class RegenerateVariantsBlock {
  protected readonly variants: Variant[] = [
    {
      id: 'concise',
      label: 'Concise',
      text:
        '**SemVer** signals breakage: a major bump means you have to read the release notes; minor and patch should be drop-in.',
    },
    {
      id: 'eli5',
      label: 'Explain like I\'m 5',
      text:
        "Imagine your favourite toy's instructions had a number. If only the last number changed, the instructions still work. If the **first** number changed, the toy might be totally different — read the new instructions!",
    },
    {
      id: 'technical',
      label: 'Technical',
      text:
        'SemVer 2.0 splits a release into `MAJOR.MINOR.PATCH`. Major increments encode source-incompatible changes; minor adds backward-compatible API surface; patch fixes bugs without altering the public contract. Tooling (npm, cargo, go modules) leans on this to choose safe upgrades during dependency resolution.',
    },
    {
      id: 'formal',
      label: 'Formal',
      text:
        'Semantic versioning provides a deterministic mechanism for communicating the nature of a release to downstream consumers. By segmenting the version into three independently-incremented integers, it allows automated dependency managers to reason about API compatibility without inspecting the changelog.',
    },
  ];

  protected readonly currentId = signal<string>('concise');
  protected readonly current = computed(
    () =>
      this.variants.find((v) => v.id === this.currentId()) ?? this.variants[0],
  );

  protected readonly code = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <div class="flex flex-1 flex-col gap-3">
    <pk-message-content [markdown]="true" [content]="current().text" />

    <div class="border-t pt-3">
      <span class="text-xs uppercase">Try a different tone</span>
      <div class="flex flex-wrap gap-2">
        @for (v of variants; track v.id) {
          <pk-prompt-suggestion
            [content]="v.label"
            [variant]="v.id === currentId() ? 'default' : 'outline'"
            (clicked)="currentId.set(v.id)"
          />
        }
      </div>
    </div>
  </div>
</pk-message>

// Component
interface Variant { id: string; label: string; text: string; }

protected readonly variants: Variant[] = [
  { id: 'concise',   label: 'Concise',   text: '...' },
  { id: 'eli5',      label: 'Explain like I am 5', text: '...' },
  { id: 'technical', label: 'Technical', text: '...' },
  { id: 'formal',    label: 'Formal',    text: '...' },
];

protected readonly currentId = signal<string>('concise');
protected readonly current = computed(
  () => this.variants.find(v => v.id === this.currentId()) ?? this.variants[0]
);`;
}
