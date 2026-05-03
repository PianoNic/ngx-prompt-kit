import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocNav } from '../layout/doc-nav';
import { PkCodeBlockImports } from 'prompt-kit-ng/code-block';

@Component({
  selector: 'app-installation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocNav, PkCodeBlockImports],
  template: `
    <article class="mx-auto max-w-3xl">
      <header class="mb-10">
        <h1 class="text-3xl font-semibold tracking-tight">Installation</h1>
        <p class="text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed">
          Get prompt-kit-ng wired into an Angular workspace. Components are
          distributed via schematics — the source lands in your project where you
          own it.
        </p>
      </header>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Prerequisites</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Before installing, make sure you have:
        </p>
        <ul class="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >Node.js</a
            >
            22 or later, or
            <a
              href="https://bun.sh"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >Bun</a
            >
            1.1+
          </li>
          <li>
            <a
              href="https://angular.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >Angular</a
            >
            19 or later (tested on 21)
          </li>
          <li>
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >Tailwind CSS</a
            >
            v4
          </li>
        </ul>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Install Spartan UI</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          prompt-kit-ng composes Spartan UI helm primitives. Install and initialize
          Spartan in your workspace first:
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="spartanInstall" language="bash" />
          </pk-code-block>
        </div>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          When prompted, select at minimum these helm components:
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">avatar</code>,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">button</code>,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">textarea</code>,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">tooltip</code>.
        </p>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Add prompt-kit-ng</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          One-time bootstrap. Patches the universal runtime deps
          (<code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">clsx</code>,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">tailwind-merge</code>)
          and warns if Spartan isn't detected.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="ngAdd" language="bash" />
          </pk-code-block>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Add components</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Generate any component into your project. The
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">cn()</code>
          utility lands alongside automatically. Component-specific deps
          (e.g. <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">marked</code>
          for markdown,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">shiki</code>
          for code-block) are added to your
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">package.json</code>
          when needed.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="ngGenerate" language="bash" />
          </pk-code-block>
        </div>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          Components land at
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >&lt;sourceRoot&gt;/app/components/prompt-kit/&lt;name&gt;/</code
          >
          by default.
        </p>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Usage</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Import the component into a standalone Angular component and use it:
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="usage" language="ts" />
          </pk-code-block>
        </div>
      </section>

      <app-doc-nav />
    </article>
  `,
})
export class Installation {
  protected readonly spartanInstall = `bun add -d @spartan-ng/cli
ng g @spartan-ng/cli:init
ng g @spartan-ng/cli:ui`;

  protected readonly ngAdd = `ng add @pianonic/prompt-kit-ng`;

  protected readonly ngGenerate = `ng generate @pianonic/prompt-kit-ng:message
ng generate @pianonic/prompt-kit-ng:prompt-input
ng generate @pianonic/prompt-kit-ng:markdown
# ...etc.`;

  protected readonly usage = `import { Component, signal } from '@angular/core';
import { PkPromptInputImports } from './components/prompt-kit/prompt-input';

@Component({
  selector: 'app-chat',
  imports: [PkPromptInputImports],
  template: \`
    <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
      <pk-prompt-input-textarea placeholder="Ask anything..." />
    </pk-prompt-input>
  \`,
})
export class Chat {
  protected readonly value = signal('');
  protected onSubmit(): void {
    console.log('submitted:', this.value());
  }
}`;
}
