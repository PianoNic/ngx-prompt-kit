import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PkLoader, type LoaderVariant } from 'prompt-kit-ng/loader';

@Component({
  selector: 'app-loader-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkLoader],
  template: `
    <h2 class="text-xl font-semibold mb-4">Loader</h2>
    <div class="grid grid-cols-3 gap-6 max-w-2xl">
      @for (v of variants; track v) {
        <div class="flex flex-col items-center gap-2 rounded border p-4">
          <pk-loader [variant]="v" />
          <span class="text-xs text-muted-foreground">{{ v }}</span>
        </div>
      }
    </div>
  `,
})
export class LoaderDemo {
  protected readonly variants: LoaderVariant[] = [
    'circular',
    'classic',
    'pulse',
    'pulse-dot',
    'dots',
    'typing',
    'wave',
    'bars',
    'terminal',
    'text-blink',
    'text-shimmer',
    'loading-dots',
  ];
}
