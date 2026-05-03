import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideEllipsis,
  lucideGlobe,
  lucidePlus,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardDescription,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { PkCodeBlockImports } from 'prompt-kit-ng/code-block';
import { PkPromptInputImports } from 'prompt-kit-ng/prompt-input';

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
    HlmIconImports,
    PkCodeBlockImports,
    PkPromptInputImports,
  ],
  providers: [provideIcons({ lucidePlus, lucideGlobe, lucideEllipsis, lucideArrowUp })],
  template: `
    <div class="mx-auto max-w-4xl py-4 md:py-12">
      <section class="text-center">
        <p class="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wider">
          prompt-kit-ng
        </p>
        <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
          AI chat components for Angular.
        </h1>
        <p class="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Standalone, signal-based components for building AI interfaces. Composes
          with Spartan UI. Distributed via schematics — the source lives in your
          project, not in a black-box dependency.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a hlmBtn routerLink="/showcase/full-chat" type="button">See it in action</a>
          <a hlmBtn variant="outline" routerLink="/blocks" type="button">Browse blocks</a>
        </div>
      </section>

      <section class="mx-auto mt-12 max-w-2xl">
        <pk-prompt-input class="block" [(value)]="heroValue" (submitted)="onHeroSubmit()">
          <pk-prompt-input-textarea placeholder="Ask prompt-kit-ng anything..." />
          <pk-prompt-input-actions class="mt-2 justify-between">
            <div class="flex items-center gap-1">
              <pk-prompt-input-action tooltip="Attach files">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" class="rounded-full" aria-label="Attach files">
                  <ng-icon hlm size="sm" name="lucidePlus" />
                </button>
              </pk-prompt-input-action>
              <pk-prompt-input-action tooltip="Search the web">
                <button hlmBtn variant="outline" size="sm" type="button" class="rounded-full gap-1.5">
                  <ng-icon hlm size="xs" name="lucideGlobe" />
                  Search
                </button>
              </pk-prompt-input-action>
              <pk-prompt-input-action tooltip="More tools">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" class="rounded-full" aria-label="More tools">
                  <ng-icon hlm size="sm" name="lucideEllipsis" />
                </button>
              </pk-prompt-input-action>
            </div>
            <pk-prompt-input-action tooltip="Send message">
              <button hlmBtn size="icon-sm" type="button" class="rounded-full" (click)="onHeroSubmit()" aria-label="Send">
                <ng-icon hlm size="xs" name="lucideArrowUp" />
              </button>
            </pk-prompt-input-action>
          </pk-prompt-input-actions>
        </pk-prompt-input>
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
            <a href="https://github.com/ibelick" target="_blank" rel="noopener noreferrer" class="text-foreground underline-offset-4 hover:underline">Julien Thibeaut (ibelick)</a>.
            MIT licensed.
          </p>
          <div class="flex items-center gap-4">
            <a href="https://github.com/PianoNic/prompt-kit-ng" target="_blank" rel="noopener noreferrer" class="hover:text-foreground">GitHub</a>
            <a href="https://www.npmjs.com/package/@pianonic/prompt-kit-ng" target="_blank" rel="noopener noreferrer" class="hover:text-foreground">npm</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class Landing {
  protected readonly heroValue = signal('');
  protected readonly lastSubmitted = signal('');

  protected readonly snippet = `<pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
  <pk-prompt-input-textarea placeholder="Ask prompt-kit-ng anything..." />
  <pk-prompt-input-actions class="mt-2 justify-between">
    <div class="flex items-center gap-1">
      <pk-prompt-input-action tooltip="Attach files">
        <button hlmBtn variant="ghost" size="icon-sm">
          <ng-icon hlm size="sm" name="lucidePlus" />
        </button>
      </pk-prompt-input-action>
      <pk-prompt-input-action tooltip="Search the web">
        <button hlmBtn variant="outline" size="sm">
          <ng-icon hlm size="xs" name="lucideGlobe" />
          Search
        </button>
      </pk-prompt-input-action>
    </div>
    <pk-prompt-input-action tooltip="Send message">
      <button hlmBtn size="icon-sm" (click)="onSubmit()">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>`;

  protected readonly features: Feature[] = [
    {
      title: 'Schematic distribution',
      description:
        'Components are copied into your project via ng generate. You own the source — edit, fork, version it on your terms.',
    },
    {
      title: 'Built on Spartan UI',
      description:
        'Composes with Spartan helm primitives (button, tooltip, avatar, textarea). Theme-consistent out of the box.',
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

  protected onHeroSubmit(): void {
    const v = this.heroValue().trim();
    if (!v) return;
    this.lastSubmitted.set(v);
    this.heroValue.set('');
  }
}
