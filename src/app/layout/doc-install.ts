import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';

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
    </section>
  `,
})
export class DocInstall {
  public readonly component = input.required<string>();
  protected readonly cmd = computed(
    () => `ng generate ngx-prompt-kit:${this.component()}`,
  );
}
