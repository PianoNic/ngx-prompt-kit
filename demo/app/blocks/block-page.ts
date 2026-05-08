import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-block-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmIconImports],
  providers: [provideIcons({ lucideArrowLeft })],
  template: `
    <div class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <a
        routerLink="/blocks"
        class="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-xs"
      >
        <ng-icon hlm size="xs" name="lucideArrowLeft" />
        All blocks
      </a>
      <header class="flex flex-col gap-2">
        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wider">Block</p>
        <h1 class="text-3xl font-semibold tracking-tight">{{ title() }}</h1>
        <p class="text-muted-foreground max-w-2xl text-sm">{{ description() }}</p>
      </header>

      <ng-content />
    </div>
  `,
})
export class BlockPage {
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();
}
