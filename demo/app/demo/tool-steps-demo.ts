import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkToolStepsImports, type PkToolStep } from 'ngx-prompt-kit/tool-steps';

const COMPLETED: PkToolStep[] = [
  {
    name: 'search',
    input: '{ "query": "angular signals" }',
    output: '3 results found',
  },
  {
    name: 'execute_javascript',
    input: 'const total = items.reduce((a, b) => a + b, 0);\nreturn total;',
    output: '42',
  },
];

const STREAMING: PkToolStep[] = [
  { name: 'search', input: '{ "query": "weather in Zurich" }', output: '18°C, partly cloudy' },
  { name: 'summarize', input: '{ "maxWords": 40 }', output: null },
];

@Component({
  selector: 'app-tool-steps-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkToolStepsImports],
  template: `
    <app-doc-page
      title="Tool Steps"
      [original]="true"
      description="Renders an assistant's tool trace from a { name, input, output }[] array — a chain-of-thought disclosure per step, input and output as code blocks. Pass the same array while streaming and after committing; a null output reads as 'Running …' and flips to 'Ran …' once it arrives."
    >
      <app-doc-example
        title="Completed steps"
        description="Each step has an output, so every trigger reads 'Ran …'. Click a step to expand its input and output."
        [code]="completedCode"
      >
        <div class="w-full max-w-xl" data-testid="tool-steps-completed">
          <pk-tool-steps [steps]="completed" />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Streaming (a step still running)"
        description="The last step has a null output, so it reads 'Running …' and omits the output block until it arrives."
        [code]="streamingCode"
      >
        <div class="w-full max-w-xl" data-testid="tool-steps-streaming">
          <pk-tool-steps [steps]="streaming" />
        </div>
      </app-doc-example>

      <app-doc-install component="tool-steps" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ToolStepsDemo {
  protected readonly completed = COMPLETED;
  protected readonly streaming = STREAMING;

  protected readonly completedCode = `<pk-tool-steps [steps]="steps" />

// steps: PkToolStep[]
[
  { name: 'search', input: '{ "query": "angular signals" }', output: '3 results found' },
  { name: 'execute_javascript', input: 'return total;', output: '42' },
]`;

  protected readonly streamingCode = `// A null output renders as "Running …" with no output block yet.
[
  { name: 'search', input: '{ "query": "weather" }', output: '18°C' },
  { name: 'summarize', input: '{ "maxWords": 40 }', output: null },
]`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkToolSteps',
      props: [
        {
          name: 'steps',
          type: 'PkToolStep[]',
          description: 'Required. Each: { name, input, output: string | null }.',
        },
        {
          name: 'inputLanguage',
          type: 'string',
          default: "'javascript'",
          description: 'Shiki language for the input code block.',
        },
        {
          name: 'outputLanguage',
          type: 'string',
          default: "'text'",
          description: 'Shiki language for the output code block.',
        },
        {
          name: 'runningLabel',
          type: 'string',
          default: "'Running'",
          description: 'Trigger prefix while a step is running (output is null).',
        },
        {
          name: 'ranLabel',
          type: 'string',
          default: "'Ran'",
          description: 'Trigger prefix once a step has finished.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];
}
