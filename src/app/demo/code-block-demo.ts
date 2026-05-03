import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'prompt-kit-ng/code-block';

@Component({
  selector: 'app-code-block-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Code Block"
      description="A bordered code container with syntax highlighting via Shiki. Lazy-loads the highlighter only in the browser."
    >
      <app-doc-example
        title="With header"
        description="A CodeBlockGroup gives the block a filename row and language tag."
        [code]="withHeaderCode"
      >
        <pk-code-block class="w-full max-w-2xl">
          <pk-code-block-group class="border-border border-b px-4 py-2 text-xs text-muted-foreground">
            <span class="font-mono">greeter.ts</span>
            <span class="uppercase tracking-wider">typescript</span>
          </pk-code-block-group>
          <pk-code-block-code [code]="ts" language="ts" />
        </pk-code-block>
      </app-doc-example>

      <app-doc-example
        title="Bare snippet"
        description="No header, just the highlighted code."
        [code]="bareCode"
      >
        <pk-code-block class="w-full max-w-2xl">
          <pk-code-block-code [code]="bash" language="bash" />
        </pk-code-block>
      </app-doc-example>

      <app-doc-install component="code-block" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class CodeBlockDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkCodeBlock',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the bordered container.' },
      ],
    },
    {
      name: 'PkCodeBlockGroup',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the header row.' },
      ],
    },
    {
      name: 'PkCodeBlockCode',
      props: [
        { name: 'code', type: 'string', default: "''", description: 'The source to highlight.' },
        { name: 'language', type: 'string', default: "'tsx'", description: 'Shiki language identifier.' },
        { name: 'theme', type: 'string', default: "'github-light'", description: 'Shiki theme name.' },
        { name: 'class', type: 'string', description: 'Extra classes for the code container.' },
      ],
    },
  ];

  protected readonly ts = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('world'));`;

  protected readonly bash = `ng add @pianonic/prompt-kit-ng
ng generate @pianonic/prompt-kit-ng:message`;

  protected readonly withHeaderCode = `<pk-code-block class="max-w-2xl">
  <pk-code-block-group class="border-b border-border px-4 py-2 text-xs">
    <span class="font-mono">greeter.ts</span>
    <span class="uppercase tracking-wider">typescript</span>
  </pk-code-block-group>
  <pk-code-block-code [code]="codeString" language="ts" />
</pk-code-block>`;

  protected readonly bareCode = `<pk-code-block class="max-w-2xl">
  <pk-code-block-code [code]="codeString" language="bash" />
</pk-code-block>`;
}
