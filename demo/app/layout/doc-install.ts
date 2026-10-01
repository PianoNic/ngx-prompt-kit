import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';

/** The spartan helm components each schematic composes; mirrors HELM_REQUIREMENTS in the library. */
const HELM: Readonly<Record<string, readonly string[]>> = {
  approval: ['badge', 'button', 'card', 'spinner'],
  'attachment-preview': ['attachment'],
  'auth-image': ['skeleton'],
  'branch-nav': ['button'],
  'chain-of-thought-steps': ['spinner'],
  'chat-turn': ['bubble', 'button'],
  composer: ['button', 'textarea'],
  'conversation-list': ['button', 'dropdown-menu', 'input'],
  'feedback-bar': ['button'],
  image: ['skeleton'],
  'message-actions-bar': ['button', 'tooltip'],
  'message-edit': ['button', 'dropdown-menu', 'textarea'],
  'model-browser': ['input-group'],
  'model-selector': ['button', 'input-group', 'sheet'],
  'prompt-suggestion': ['button'],
  source: ['hover-card'],
  'token-counter': ['progress'],
  tool: ['badge', 'spinner'],
  'usage-card': ['avatar', 'button', 'card', 'progress', 'tooltip'],
};

@Component({
  selector: 'app-doc-install',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkCodeBlockImports],
  template: `
    <section class="mt-12">
      <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
      <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
        Add the {{ component() }} component (and the
        <code class="font-mono text-xs">cn()</code> utility) to your project.
      </p>
      <div class="mt-3">
        <pk-code-block>
          <pk-code-block-code [code]="cmd()" language="bash" />
        </pk-code-block>
      </div>
      @if (helm().length) {
        <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
          It is built on spartan/ui, so add these helm components too:
          @for (name of helm(); track name; let last = $last) {
            <code class="font-mono text-xs">{{ name }}</code
            >{{ last ? '.' : ', ' }}
          }
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="helmCmd()" language="bash" />
          </pk-code-block>
        </div>
      }
    </section>
  `,
})
export class DocInstall {
  public readonly component = input.required<string>();
  protected readonly cmd = computed(() => `ng generate ngx-prompt-kit:${this.component()}`);
  protected readonly helm = computed(() => HELM[this.component()] ?? []);
  protected readonly helmCmd = computed(() => `ng g @spartan-ng/cli:ui ${this.helm().join(' ')}`);
}
