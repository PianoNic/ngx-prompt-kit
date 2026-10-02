import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCoffee, lucideEllipsis, lucideGlobe } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardDescription, HlmCardHeader, HlmCardTitle } from '@spartan-ng/helm/card';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { PkComposerImports } from 'ngx-prompt-kit/composer';

interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HlmButton,
    HlmCard,
    HlmCardDescription,
    HlmCardHeader,
    HlmCardTitle,
    HlmTooltip,
    NgIcon,
    PkCodeBlockImports,
    PkComposerImports,
  ],
  providers: [provideIcons({ lucideGlobe, lucideEllipsis, lucideCoffee })],
  template: `
    <div class="mx-auto max-w-4xl py-4 md:py-12">
      <section class="text-center">
        <p class="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wider">
          ngx-prompt-kit
        </p>
        <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
          AI chat components for Angular.
        </h1>
        <p class="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Standalone, signal-based components for building AI interfaces. Composes with Spartan UI.
          Distributed via schematics — the source lives in your project, not in a black-box
          dependency.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a hlmBtn routerLink="/installation" type="button">Get started</a>
          <a hlmBtn variant="outline" routerLink="/showcase/full-chat" type="button"
            >See it in action</a
          >
        </div>
      </section>

      <section class="mx-auto mt-12 max-w-2xl">
        <div class="rounded-2xl border bg-background px-3 pt-2 pb-3">
          <pk-composer
            placeholder="Ask ngx-prompt-kit anything..."
            [attachable]="true"
            [(value)]="heroValue"
            (submitted)="onHeroSubmit($event)"
          >
            <button
              pkComposerStart
              hlmBtn
              variant="outline"
              size="sm"
              type="button"
              class="gap-1.5 rounded-full"
              hlmTooltip="Search the web"
            >
              <ng-icon name="lucideGlobe" class="text-[length:--spacing(3)]" />
              Search
            </button>
            <button
              pkComposerStart
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              class="rounded-full"
              hlmTooltip="More tools"
              aria-label="More tools"
            >
              <ng-icon name="lucideEllipsis" class="text-[length:--spacing(4)]" />
            </button>
          </pk-composer>
        </div>
        @if (lastSubmitted()) {
          <p class="text-muted-foreground mt-2 text-center text-xs">
            Submitted: <span class="text-foreground font-mono">{{ lastSubmitted() }}</span>
          </p>
        }

        <div class="mt-8">
          <p class="text-muted-foreground mb-2 px-1 text-xs font-medium uppercase tracking-wider">
            What you write
          </p>
          <pk-code-block>
            <pk-code-block-code [code]="snippet" language="html" />
          </pk-code-block>
        </div>
      </section>

      <section class="mt-20">
        <h2 class="text-center text-2xl font-semibold tracking-tight">
          Built for the Angular way of working.
        </h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (f of features; track f.title) {
            <div hlmCard>
              <div hlmCardHeader>
                <h3 hlmCardTitle>{{ f.title }}</h3>
                <p hlmCardDescription>{{ f.description }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <footer class="border-border text-muted-foreground mt-20 border-t pt-6 text-sm">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <p>
            Original React implementation by
            <a
              href="https://github.com/ibelick"
              target="_blank"
              rel="noopener noreferrer"
              class="text-foreground underline-offset-4 hover:underline"
              >Julien Thibeaut (ibelick)</a
            >. MIT licensed.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/PianoNic/ngx-prompt-kit"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground"
              >GitHub</a
            >
            <a
              href="https://www.npmjs.com/package/ngx-prompt-kit"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground"
              >npm</a
            >
            <a
              href="https://buymeacoffee.com/PianoNic"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ng-icon name="lucideCoffee" class="text-[length:--spacing(3)]" />
              Buy me a coffee
            </a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class Landing {
  protected readonly heroValue = signal('');
  protected readonly lastSubmitted = signal('');

  protected readonly snippet = `<div class="rounded-2xl border bg-background px-3 pt-2 pb-3">
  <pk-composer
    placeholder="Ask ngx-prompt-kit anything..."
    [attachable]="true"
    [(value)]="value"
    (submitted)="onSubmit($event)"
  >
    <button pkComposerStart hlmBtn variant="outline" size="sm" hlmTooltip="Search the web">
      <ng-icon name="lucideGlobe" class="text-[length:--spacing(3)]" />
      Search
    </button>
  </pk-composer>
</div>`;

  protected readonly features: Feature[] = [
    {
      title: 'Schematic distribution',
      description:
        'Components are copied into your project via ng generate. You own the source — edit, fork, version it on your terms.',
    },
    {
      title: 'Built on Spartan UI',
      description:
        'Built from Spartan helm and brain primitives (button, textarea, collapsible, hover card, sheet). Where Spartan already has the piece, use it directly. Theme-consistent out of the box.',
    },
    {
      title: 'Signal-based + standalone',
      description:
        'Every component uses input(), output(), computed(). No NgModules. Zoneless-friendly. OnPush throughout.',
    },
    {
      title: 'AI-chat-ready primitives',
      description:
        'Streaming responses, markdown with code highlighting, file drop zones, expanding reasoning blocks — the AI surface area covered.',
    },
    {
      title: 'Tailwind v4 native',
      description:
        'Plain Tailwind utility classes, no proprietary CSS-in-JS. Inherits your existing design tokens.',
    },
    {
      title: 'SSR-safe',
      description:
        'Browser APIs (clipboard, ResizeObserver, requestAnimationFrame) guarded behind isPlatformBrowser. Renders on the server without crashing.',
    },
  ];

  protected onHeroSubmit(text: string): void {
    this.lastSubmitted.set(text);
  }
}
