import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PkCodeBlockImports } from 'prompt-kit-ng';

@Component({
  selector: 'app-code-block-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkCodeBlockImports],
  template: `
    <h2 class="text-xl font-semibold mb-4">Code Block</h2>
    <pk-code-block class="max-w-2xl">
      <pk-code-block-group class="border-b border-border px-4 py-2 text-xs text-muted-foreground">
        <span>greeting.ts</span>
        <span>typescript</span>
      </pk-code-block-group>
      <pk-code-block-code [code]="code" language="ts" />
    </pk-code-block>
  `,
})
export class CodeBlockDemo {
  protected readonly code = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('world'));`;
}
