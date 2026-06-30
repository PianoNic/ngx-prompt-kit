import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkLoader, type LoaderVariant } from 'ngx-prompt-kit/loader';

interface VariantSpec {
  variant: LoaderVariant;
  label: string;
}

@Component({
  selector: 'app-loader-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkLoader],
  template: `
    <app-doc-page
      title="Loader"
      description="Twelve loading-state variants for AI chat: spinners, dots, bars, terminal cursor, and animated text."
    >
      <app-doc-example
        title="All variants"
        description="Same component, different variant input."
        [code]="variantsCode"
      >
        <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          @for (v of variants; track v.variant) {
            <div
              class="border-border flex flex-col items-center justify-center gap-3 rounded-md border p-6 min-h-[100px]"
            >
              <pk-loader [variant]="v.variant" />
              <span class="text-muted-foreground text-xs font-mono">{{ v.label }}</span>
            </div>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Sizes"
        description="Pass size='sm' | 'md' | 'lg' for variants that have a fixed footprint."
        [code]="sizesCode"
      >
        <div class="flex w-full items-end justify-around gap-6">
          <pk-loader variant="dots" size="sm" />
          <pk-loader variant="dots" size="md" />
          <pk-loader variant="dots" size="lg" />
        </div>
      </app-doc-example>

      <app-doc-install component="loader" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class LoaderDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkLoader',
      props: [
        {
          name: 'variant',
          type: 'LoaderVariant',
          default: '"circular"',
          description:
            'circular | classic | pulse | pulse-dot | dots | typing | wave | bars | terminal | text-blink | text-shimmer | loading-dots',
        },
        {
          name: 'size',
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: 'Visual size for variants with a fixed footprint.',
        },
        {
          name: 'text',
          type: 'string',
          default: '"Thinking"',
          description: 'Label for text-* variants.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];

  protected readonly variants: VariantSpec[] = [
    { variant: 'circular', label: 'circular' },
    { variant: 'classic', label: 'classic' },
    { variant: 'pulse', label: 'pulse' },
    { variant: 'pulse-dot', label: 'pulse-dot' },
    { variant: 'dots', label: 'dots' },
    { variant: 'typing', label: 'typing' },
    { variant: 'wave', label: 'wave' },
    { variant: 'bars', label: 'bars' },
    { variant: 'terminal', label: 'terminal' },
    { variant: 'text-blink', label: 'text-blink' },
    { variant: 'text-shimmer', label: 'text-shimmer' },
    { variant: 'loading-dots', label: 'loading-dots' },
  ];

  protected readonly variantsCode = `<pk-loader variant="circular" />
<pk-loader variant="classic" />
<pk-loader variant="pulse" />
<pk-loader variant="pulse-dot" />
<pk-loader variant="dots" />
<pk-loader variant="typing" />
<pk-loader variant="wave" />
<pk-loader variant="bars" />
<pk-loader variant="terminal" />
<pk-loader variant="text-blink" text="Thinking" />
<pk-loader variant="text-shimmer" text="Thinking" />
<pk-loader variant="loading-dots" text="Thinking" />`;

  protected readonly sizesCode = `<pk-loader variant="dots" size="sm" />
<pk-loader variant="dots" size="md" />
<pk-loader variant="dots" size="lg" />`;
}
