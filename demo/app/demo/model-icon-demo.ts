import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { iconUrl, makerIconUrl, providerIconUrl, VENDORS } from 'ngx-prompt-kit/model-icon';

const SAMPLE_IDS = [
  'openai/gpt-5',
  'anthropic/claude-sonnet-5.5',
  '~anthropic/claude-opus-5.5',
  'google/gemini-3-pro',
  'google/gemma-3-27b-it',
  'meta-llama/llama-4-maverick',
  'mistralai/mistral-large',
  'deepseek/deepseek-v4',
  'x-ai/grok-5',
  'somevendor/mystery-model',
];

/** The inference providers in the bundled set; iconUrl(name) resolves each. */
const PROVIDERS = [
  'ai21',
  'akashml',
  'aleph-alpha',
  'alibaba-cloud',
  'assemblyai',
  'atlascloud',
  'aws',
  'azure-ai',
  'azure',
  'baidu-cloud',
  'baseten',
  'bedrock',
  'cerebras',
  'chutes',
  'cloudflare',
  'coreweave',
  'crusoe',
  'decart',
  'deepgram',
  'deepinfra',
  'digitalocean',
  'elevenlabs',
  'featherless',
  'fishaudio',
  'friendli',
  'github',
  'glama',
  'gmicloud',
  'google-ai-studio',
  'groq',
  'huggingface',
  'hyperbolic',
  'ibm',
  'inceptron',
  'infermatic',
  'infomaniak',
  'ionet',
  'ionos',
  'jina',
  'kluster',
  'lambda',
  'llama-cpp',
  'lmstudio',
  'localai',
  'modal',
  'nebius',
  'nextbit',
  'novita',
  'ollama',
  'open-inference',
  'ovhcloud',
  'parasail',
  'phala',
  'prime-intellect',
  'replicate',
  'sail-research',
  'sambanova',
  'scaleway',
  'siliconflow',
  'snowflake',
  'streamlake',
  'targon',
  'tencent-cloud',
  'together',
  'venice',
  'vercel',
  'vertex-ai',
  'vllm',
  'voyage',
  'wafer',
  'workers-ai',
  'xinference',
  'zenmux',
];

const SOURCES_URL =
  'https://github.com/PianoNic/ngx-prompt-kit/blob/master/src/library/src/model-icon/assets/SOURCES.md';

@Component({
  selector: 'app-model-icon-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocApi, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Model Icon"
      [original]="true"
      description="A monochrome icon for every OpenRouter vendor, copied into your app by the schematic and served with it, so no icon is fetched from a third party. providerIconUrl() and makerIconUrl() turn a model id into its icon's URL for pk-model-selector (iconUrl, makerIconUrl) and pk-model-browser (iconUrl). Vendors without an icon get a neutral box. The set also has an icon per inference provider (Groq, Azure, Bedrock, Ollama, ...), which iconUrl() resolves by file name."
    >
      <app-doc-example
        title="Every bundled icon"
        description="One SVG per vendor slug (the part of the model id before the slash), plus gemma and the unknown fallback. They are black on transparent: render them with dark:invert, as in the dark panel."
        [code]="gridCode"
      >
        <div class="grid w-full gap-4 md:grid-cols-2">
          @for (dark of [false, true]; track dark) {
            <div
              [class]="dark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-white text-neutral-700'"
              class="grid grid-cols-3 gap-1 rounded-lg border p-3 sm:grid-cols-4"
            >
              @for (slug of slugs; track slug) {
                <div class="flex min-w-0 flex-col items-center gap-1 rounded-md p-2">
                  <img
                    [src]="'/model-icons/' + slug + '.svg'"
                    [alt]="slug"
                    width="20"
                    height="20"
                    [class.invert]="dark"
                    class="size-5 object-contain"
                  />
                  <span class="w-full truncate text-center font-mono text-[10px]">{{ slug }}</span>
                </div>
              }
            </div>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Model id → icon"
        description="providerIconUrl gives Gemma its own icon under Google; makerIconUrl always gives the vendor's, which is what the selector's maker rail shows. The ~vendor alias form resolves like the vendor; an unknown vendor gets the box."
        [code]="usageCode"
        language="typescript"
      >
        <div class="grid w-full max-w-2xl grid-cols-1 gap-1">
          @for (id of ids; track id) {
            <div class="flex items-center gap-3 rounded-md border p-2 text-sm">
              <img
                [src]="provider(id)"
                [alt]="id + ' icon'"
                class="h-5 w-5 shrink-0 object-contain dark:invert"
              />
              <img
                [src]="maker(id)"
                [alt]="id + ' maker icon'"
                class="h-5 w-5 shrink-0 object-contain dark:invert"
              />
              <span class="text-muted-foreground truncate font-mono text-xs">{{ id }}</span>
            </div>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Provider icons"
        description="The platforms that serve models: clouds, hosted inference, local runtimes and speech or embedding APIs. They are not keyed by model id, so iconUrl(name) takes the file name. It does not check the file exists; these are the names in the set."
        [code]="providerCode"
        language="typescript"
      >
        <div class="grid w-full gap-4 md:grid-cols-2">
          @for (dark of [false, true]; track dark) {
            <div
              [class]="dark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-white text-neutral-700'"
              class="grid grid-cols-3 gap-1 rounded-lg border p-3 sm:grid-cols-4"
            >
              @for (name of providers; track name) {
                <div class="flex min-w-0 flex-col items-center gap-1 rounded-md p-2">
                  <img
                    [src]="icon(name)"
                    [alt]="name"
                    width="20"
                    height="20"
                    [class.invert]="dark"
                    class="size-5 object-contain"
                  />
                  <span class="w-full truncate text-center font-mono text-[10px]">{{ name }}</span>
                </div>
              }
            </div>
          }
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Adds the helpers to your components folder and copies the icons, with SOURCES.md, to
          <code class="font-mono text-xs">public/model-icons</code>. Pass
          <code class="font-mono text-xs">--assets-path</code> to put them in another folder your
          app serves; the helpers' URLs follow it (<code class="font-mono text-xs"
            >src/assets/model-icons</code
          >
          is served at <code class="font-mono text-xs">/assets/model-icons</code>).
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="installCmd" language="bash" />
          </pk-code-block>
        </div>
        <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
          Where each icon comes from and its licence is listed in
          <a [href]="sourcesUrl" target="_blank" rel="noopener noreferrer" class="underline"
            >SOURCES.md</a
          >, which is copied next to the icons. Most are LobeHub's (MIT), a few Simple Icons' (CC0);
          every logo stays a trademark of its owner and only labels that owner's models or service.
        </p>
      </section>

      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ModelIconDemo {
  protected readonly ids = SAMPLE_IDS;
  protected readonly providers = PROVIDERS;
  protected readonly slugs = [...VENDORS, 'gemma', 'unknown'];
  protected readonly sourcesUrl = SOURCES_URL;

  protected provider(id: string): string {
    return providerIconUrl({ id });
  }

  protected icon(name: string): string {
    return iconUrl(name);
  }

  protected maker(id: string): string {
    return makerIconUrl({ id });
  }

  protected readonly installCmd = `ng generate ngx-prompt-kit:model-icon
# or into another static folder
ng generate ngx-prompt-kit:model-icon --assets-path=src/assets/model-icons`;

  protected readonly gridCode = `<img [src]="providerIconUrl(model)" alt="" class="size-4 dark:invert" />`;

  protected readonly usageCode = `import { makerIconUrl, providerIconUrl } from 'ngx-prompt-kit/model-icon';

// pk-model-selector: the row icon, and the maker's own icon for the rail
const models: SelectorModel[] = apiModels.map((m) => ({
  ...m,
  iconUrl: providerIconUrl(m),
  makerIconUrl: makerIconUrl(m),
}));

// pk-model-browser
const browserModels = apiModels.map((m) => ({ ...m, iconUrl: providerIconUrl(m) }));`;

  protected readonly providerCode = `import { iconUrl } from 'ngx-prompt-kit/model-icon';

// The platform serving the model, next to its maker's icon
const servedBy = { name: 'Groq', iconUrl: iconUrl('groq') }; // /model-icons/groq.svg`;

  protected readonly api: ApiSection[] = [
    {
      name: 'model-icon',
      props: [
        {
          name: 'providerIconUrl(model)',
          type: '({ id, provider? }) => string',
          description:
            "The model's icon: its vendor's, or Gemma's for Google's Gemma models. The vendor is the part of the id before the slash (a leading ~ is dropped), or provider when the id has none.",
        },
        {
          name: 'makerIconUrl(model)',
          type: '({ id, provider? }) => string',
          description:
            "The vendor's own icon, without sub-brands; for pk-model-selector's maker rail.",
        },
        {
          name: 'iconUrl(name)',
          type: '(name: string) => string',
          description:
            'The icon with this file name, without .svg: for inference providers (groq, azure, ollama, ...), which are not keyed by model id. Follows assetsPath like the others; does not check the file exists.',
        },
        {
          name: 'VENDORS',
          type: 'ReadonlySet<string>',
          description: 'The vendor slugs that have an icon. Anything else resolves to unknown.svg.',
        },
        {
          name: 'modelIconUrl(model)',
          type: '({ id, provider? }) => string',
          description: 'Deprecated alias of providerIconUrl, kept for existing callers.',
        },
      ],
    },
  ];
}
