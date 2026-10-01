import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkComposerImports } from 'ngx-prompt-kit/composer';
import {
  PkReasoningSelectorImports,
  type ReasoningLevelOption,
} from 'ngx-prompt-kit/reasoning-selector';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';

type Effort = 'minimal' | 'low' | 'high';

const THREE_LEVELS: readonly ReasoningLevelOption<Effort>[] = [
  {
    value: 'minimal',
    label: 'Quick',
    description: 'Barely thinks',
    strength: 1,
    speed: 5,
    credits: 1,
  },
  { value: 'low', label: 'Standard', description: 'The usual', strength: 2, speed: 3, credits: 3 },
  {
    value: 'high',
    label: 'Thorough',
    description: 'Takes its time',
    strength: 4,
    speed: 1,
    credits: 5,
  },
];

@Component({
  selector: 'app-reasoning-selector-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkComposerImports, PkReasoningSelectorImports],
  template: `
    <app-doc-page
      title="Reasoning Selector"
      [original]="true"
      description="A composer-toolbar picker for how long the model reasons before answering. The trigger shows a strength glyph and the level's name; the menu, a spartan dropdown menu of radio items, lists each level with a one-line description, and its footer rates the highlighted level's speed and credits as it follows the pointer and the arrow keys."
    >
      <app-doc-example
        title="In a composer"
        description="Placed in the composer's end slot, left of the model button. Arrow keys move through the levels, Enter picks one, Escape closes the menu and returns focus to the trigger."
        [code]="composerCode"
      >
        <div class="flex min-h-[420px] flex-col justify-end">
          <pk-composer-dock variant="card" class="mx-auto max-w-2xl">
            <pk-composer placeholder="Ask anything" [attachable]="true">
              <pk-reasoning-selector pkComposerEnd [(value)]="level" />
            </pk-composer>
          </pk-composer-dock>
        </div>
        <p class="text-muted-foreground mt-4 text-xs">
          value: <span class="text-foreground font-mono">{{ level() ?? 'null (auto)' }}</span>
        </p>
      </app-doc-example>

      <app-doc-example
        title="Your own levels"
        description="Pass levels with your provider's values. Leave out an entry with value null to drop Auto, and leave out speed and credits to drop the footer."
        [code]="customCode"
        [centered]="true"
      >
        <div class="flex min-h-[280px] items-end">
          <pk-reasoning-selector [levels]="threeLevels" [(value)]="effort" />
        </div>
        <p class="text-muted-foreground mt-4 text-xs">
          value: <span class="text-foreground font-mono">{{ effort() }}</span>
        </p>
      </app-doc-example>

      <app-doc-example
        title="Glyphs"
        description="pk-reasoning-glyph on its own, for showing a level elsewhere (a message header, a settings row). Give it a label when no text next to it names the level."
        [code]="glyphCode"
        [centered]="true"
      >
        <div class="flex items-center gap-6">
          <pk-reasoning-glyph strength="auto" label="Auto" />
          @for (strength of strengths; track strength) {
            <pk-reasoning-glyph [strength]="strength" [label]="'Strength ' + strength + ' of 4'" />
          }
        </div>
      </app-doc-example>

      <app-doc-example title="Disabled" [code]="disabledCode" [centered]="true">
        <pk-reasoning-selector [disabled]="true" value="medium" />
      </app-doc-example>

      <app-doc-install component="reasoning-selector" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ReasoningSelectorDemo {
  protected readonly level = signal<string | null>('medium');
  protected readonly effort = signal<Effort | null>('low');
  protected readonly threeLevels = THREE_LEVELS;
  protected readonly strengths = [0, 1, 2, 3, 4] as const;

  protected readonly composerCode = `<pk-composer placeholder="Ask anything" [attachable]="true">
  <pk-reasoning-selector pkComposerEnd [(value)]="level" />
  <pk-model-selector pkComposerEnd ... />
</pk-composer>

// level = signal<string | null>('medium');  // null = Auto
// Defaults: Auto (null), Off 'none', Light 'low', Balanced 'medium', Deep 'high', Maximum 'max'`;

  protected readonly customCode = `type Effort = 'minimal' | 'low' | 'high';

const LEVELS: ReasoningLevelOption<Effort>[] = [
  { value: 'minimal', label: 'Quick', description: 'Barely thinks', strength: 1, speed: 5, credits: 1 },
  { value: 'low', label: 'Standard', description: 'The usual', strength: 2, speed: 3, credits: 3 },
  { value: 'high', label: 'Thorough', description: 'Takes its time', strength: 4, speed: 1, credits: 5 },
];

<pk-reasoning-selector [levels]="levels" [(value)]="effort" />`;

  protected readonly glyphCode = `<pk-reasoning-glyph strength="auto" label="Auto" />
<pk-reasoning-glyph [strength]="2" label="Strength 2 of 4" />`;

  protected readonly disabledCode = `<pk-reasoning-selector [disabled]="true" value="medium" />`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkReasoningSelector',
      props: [
        {
          name: 'levels',
          type: 'ReasoningLevelOption<T>[]',
          default: 'DEFAULT_REASONING_LEVELS',
          description:
            'The rows, in order. An entry with strength "auto" is followed by a divider. { value: T | null, label, description?, strength: 0-4 | "auto", speed?: 1-5, credits?: 1-5 }.',
        },
        {
          name: 'value',
          type: 'model<T | null>',
          default: 'null',
          description:
            'The picked level, two-way with [(value)]. null is the auto entry. A value no level has shows the auto entry (or the first).',
        },
        {
          name: 'valueChange',
          type: 'output<T | null>',
          description: 'Fires when a level is picked.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the trigger.',
        },
        {
          name: 'label',
          type: 'string',
          default: "'Reasoning'",
          description:
            'The menu heading and accessible name; the trigger is named "<label>: <level>".',
        },
        {
          name: 'side',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: 'Where the menu opens; it flips when there is no room.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'start'",
          description: 'How the menu lines up with the trigger.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'PkReasoningGlyph',
      props: [
        {
          name: 'strength',
          type: '0 | 1 | 2 | 3 | 4 | "auto"',
          description: 'Filled bars, or a sparkle for auto.',
        },
        {
          name: 'label',
          type: 'string',
          default: "''",
          description: 'Accessible name (role="img"). Empty leaves the glyph decorative.',
        },
      ],
    },
  ];
}
