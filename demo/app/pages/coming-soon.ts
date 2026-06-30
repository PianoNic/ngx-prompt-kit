import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmButton],
  template: `
    <div
      class="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p class="text-muted-foreground text-xs font-medium uppercase tracking-wider">Coming soon</p>
      <h1 class="text-3xl font-semibold tracking-tight">{{ title() }}</h1>
      <p class="text-muted-foreground max-w-md">
        Not built yet. In the meantime, browse the per-component demos to see each ngx-prompt-kit
        piece in isolation.
      </p>
      <a hlmBtn variant="outline" routerLink="/components/message" type="button">
        Component demos
      </a>
    </div>
  `,
})
export class ComingSoon {
  public readonly title = input.required<string>();
}
