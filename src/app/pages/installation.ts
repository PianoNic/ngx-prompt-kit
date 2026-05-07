import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { DocNav } from '../layout/doc-nav';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';

@Component({
  selector: 'app-installation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocNav, HlmTabsImports, PkCodeBlockImports],
  template: `
    <article class="mx-auto max-w-3xl">
      <header class="mb-10">
        <h1 class="text-3xl font-semibold tracking-tight">Installation</h1>
        <p class="text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed">
          Get ngx-prompt-kit wired into an Angular workspace. Components are
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
              href="https://bun.sh"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >Bun</a
            >
            1.1+ or
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline underline-offset-4"
              >npm</a
            >
            10+ (Node.js 22+)
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
          ngx-prompt-kit composes Spartan UI helm primitives. Install and initialize
          Spartan in your workspace first:
        </p>
        <div class="mt-3">
          <hlm-tabs tab="ng">
            <hlm-tabs-list variant="line">
              <button hlmTabsTrigger="bun">Bun</button>
              <button hlmTabsTrigger="npm">npm</button>
              <button hlmTabsTrigger="ng">ng</button>
            </hlm-tabs-list>
            <div hlmTabsContent="bun" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="spartanBun" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="npm" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="spartanNpm" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="ng" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="spartanNg" language="bash" />
              </pk-code-block>
            </div>
          </hlm-tabs>
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
        <h2 class="text-xl font-semibold tracking-tight">Add ngx-prompt-kit</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          One-time bootstrap. Patches the universal runtime deps
          (<code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">clsx</code>,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">tailwind-merge</code>)
          and warns if Spartan isn't detected.
        </p>
        <div class="mt-3">
          <hlm-tabs tab="ng">
            <hlm-tabs-list variant="line">
              <button hlmTabsTrigger="bun">Bun</button>
              <button hlmTabsTrigger="npm">npm</button>
              <button hlmTabsTrigger="ng">ng</button>
            </hlm-tabs-list>
            <div hlmTabsContent="bun" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngAddBun" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="npm" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngAddNpm" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="ng" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngAddNg" language="bash" />
              </pk-code-block>
            </div>
          </hlm-tabs>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Configure install path</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Optional but recommended. Picks where component sources land and persists it to
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">components.json</code>
          so subsequent generates don't ask. Skip this and components will use the
          default
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">libs/prompt-kit</code>.
        </p>
        <div class="mt-3">
          <hlm-tabs tab="ng">
            <hlm-tabs-list variant="line">
              <button hlmTabsTrigger="bun">Bun</button>
              <button hlmTabsTrigger="npm">npm</button>
              <button hlmTabsTrigger="ng">ng</button>
            </hlm-tabs-list>
            <div hlmTabsContent="bun" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="initBun" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="npm" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="initNpm" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="ng" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="initNg" language="bash" />
              </pk-code-block>
            </div>
          </hlm-tabs>
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
          <hlm-tabs tab="ng">
            <hlm-tabs-list variant="line">
              <button hlmTabsTrigger="bun">Bun</button>
              <button hlmTabsTrigger="npm">npm</button>
              <button hlmTabsTrigger="ng">ng</button>
            </hlm-tabs-list>
            <div hlmTabsContent="bun" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngGenerateBun" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="npm" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngGenerateNpm" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="ng" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="ngGenerateNg" language="bash" />
              </pk-code-block>
            </div>
          </hlm-tabs>
        </div>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          Components land at
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >libs/prompt-kit/&lt;name&gt;/</code
          >
          by default. Override per command with
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >--path</code
          >, or set a workspace-wide path with
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >ng g ngx-prompt-kit:init</code
          >.
        </p>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Bulk install (interactive)</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Pick multiple components from a checklist instead of generating each one manually.
          The
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">cn()</code>
          utility and any component dependencies are still installed automatically.
        </p>
        <div class="mt-3">
          <hlm-tabs tab="ng">
            <hlm-tabs-list variant="line">
              <button hlmTabsTrigger="bun">Bun</button>
              <button hlmTabsTrigger="npm">npm</button>
              <button hlmTabsTrigger="ng">ng</button>
            </hlm-tabs-list>
            <div hlmTabsContent="bun" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="uiBun" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="npm" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="uiNpm" language="bash" />
              </pk-code-block>
            </div>
            <div hlmTabsContent="ng" class="mt-3">
              <pk-code-block>
                <pk-code-block-code [code]="uiNg" language="bash" />
              </pk-code-block>
            </div>
          </hlm-tabs>
        </div>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          Skip the prompt with
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >--components=message,prompt-input,markdown</code
          >.
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
  protected readonly spartanBun = `bun add -d @spartan-ng/cli
bun x ng g @spartan-ng/cli:init
bun x ng g @spartan-ng/cli:ui`;

  protected readonly spartanNpm = `npm install --save-dev @spartan-ng/cli
npx ng g @spartan-ng/cli:init
npx ng g @spartan-ng/cli:ui`;

  protected readonly spartanNg = `# requires @angular/cli installed globally
ng add @spartan-ng/cli
ng g @spartan-ng/cli:init
ng g @spartan-ng/cli:ui`;

  protected readonly ngAddBun = `bun x ng add ngx-prompt-kit`;
  protected readonly ngAddNpm = `npx ng add ngx-prompt-kit`;
  protected readonly ngAddNg = `ng add ngx-prompt-kit`;

  protected readonly initBun = `bun x ng generate ngx-prompt-kit:init`;
  protected readonly initNpm = `npx ng generate ngx-prompt-kit:init`;
  protected readonly initNg = `ng generate ngx-prompt-kit:init`;

  protected readonly uiBun = `bun x ng generate ngx-prompt-kit:ui`;
  protected readonly uiNpm = `npx ng generate ngx-prompt-kit:ui`;
  protected readonly uiNg = `ng generate ngx-prompt-kit:ui`;

  protected readonly ngGenerateBun = `bun x ng generate ngx-prompt-kit:message
bun x ng generate ngx-prompt-kit:prompt-input
bun x ng generate ngx-prompt-kit:markdown
# ...etc.`;

  protected readonly ngGenerateNpm = `npx ng generate ngx-prompt-kit:message
npx ng generate ngx-prompt-kit:prompt-input
npx ng generate ngx-prompt-kit:markdown
# ...etc.`;

  protected readonly ngGenerateNg = `ng generate ngx-prompt-kit:message
ng generate ngx-prompt-kit:prompt-input
ng generate ngx-prompt-kit:markdown
# ...etc.`;

  protected readonly usage = `import { Component, signal } from '@angular/core';
import { PkPromptInputImports } from 'libs/prompt-kit/prompt-input';

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
