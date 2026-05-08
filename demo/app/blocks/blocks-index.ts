import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOCKS } from './blocks-data';

@Component({
  selector: 'app-blocks-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <header class="flex flex-col gap-2">
        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wider">Showcase</p>
        <h1 class="text-3xl font-semibold tracking-tight">Blocks</h1>
        <p class="text-muted-foreground max-w-2xl text-sm">
          Composed patterns that combine multiple ngx-prompt-kit components into copy-pasteable
          recipes. Pick a block to see it in isolation.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @for (b of blocks; track b.slug) {
          <a
            [routerLink]="['/blocks', b.slug]"
            class="group border-border bg-background hover:border-primary/40 hover:bg-muted/40 flex flex-col overflow-hidden rounded-lg border transition-colors"
          >
            <div class="border-border flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b bg-white p-3 dark:bg-black">
              <!-- One thumbnail per theme; the .dark class flip on documentElement
                   swaps which one is visible. Tailwind's dark: variant ships zero JS. -->
              <img
                [src]="'blocks/' + b.slug + '-light.jpeg'"
                [alt]="b.title + ' preview (light)'"
                loading="lazy"
                decoding="async"
                class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:hidden"
              />
              <img
                [src]="'blocks/' + b.slug + '-dark.jpeg'"
                [alt]="b.title + ' preview (dark)'"
                loading="lazy"
                decoding="async"
                class="hidden max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:block"
              />
            </div>
            <div class="flex flex-col gap-1.5 p-5">
              <h2 class="text-foreground text-base font-medium">{{ b.title }}</h2>
              <p class="text-muted-foreground text-sm">{{ b.description }}</p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class BlocksIndex {
  protected readonly blocks = BLOCKS;
}
