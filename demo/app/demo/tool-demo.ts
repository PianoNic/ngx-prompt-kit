import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkTool, type ToolPart } from 'ngx-prompt-kit/tool';

@Component({
  selector: 'app-tool-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkTool],
  template: `
    <app-doc-page
      title="Tool"
      description="Visualization for an agent tool-call. Four states (input-streaming, input-available, output-available, output-error), expandable body with the input args, output, error, and call ID."
    >
      <app-doc-example
        title="Output available (success)"
        description="Most common steady state — the tool returned a result."
        [code]="successCode"
      >
        <pk-tool [toolPart]="success" [defaultOpen]="true" class="w-full max-w-xl" />
      </app-doc-example>

      <app-doc-example
        title="Input streaming"
        description="The model is still composing the tool's arguments. Spinner icon, blue badge."
        [code]="streamingCode"
      >
        <pk-tool [toolPart]="streaming" class="w-full max-w-xl" />
      </app-doc-example>

      <app-doc-example
        title="Input ready, awaiting execution"
        description="Args parsed, tool not yet invoked. Orange 'Ready' badge."
        [code]="readyCode"
      >
        <pk-tool [toolPart]="ready" class="w-full max-w-xl" />
      </app-doc-example>

      <app-doc-example
        title="Output error"
        description="Tool returned an error. Red badge plus a dedicated Error section in the body."
        [code]="errorCode"
      >
        <pk-tool [toolPart]="errored" [defaultOpen]="true" class="w-full max-w-xl" />
      </app-doc-example>

      <app-doc-install component="tool" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ToolDemo {
  protected readonly success: ToolPart = {
    type: 'fetch_weather',
    state: 'output-available',
    input: { city: 'Zurich', units: 'metric' },
    output: { temp_c: 11.4, condition: 'Partly cloudy', humidity: 78 },
    toolCallId: 'call_8c1e9a4f',
  };

  protected readonly streaming: ToolPart = {
    type: 'web_search',
    state: 'input-streaming',
    input: { query: 'angular signals best p' },
    toolCallId: 'call_2db77ed1',
  };

  protected readonly ready: ToolPart = {
    type: 'list_files',
    state: 'input-available',
    input: { path: './src/app', recursive: true },
    toolCallId: 'call_44a812bc',
  };

  protected readonly errored: ToolPart = {
    type: 'send_email',
    state: 'output-error',
    input: { to: 'invalid@@example', subject: 'Hello' },
    errorText: 'SMTP rejected: 550 5.1.1 Recipient address invalid.',
    toolCallId: 'call_e0987c44',
  };

  protected readonly successCode = `<pk-tool [toolPart]="{
  type: 'fetch_weather',
  state: 'output-available',
  input: { city: 'Zurich', units: 'metric' },
  output: { temp_c: 11.4, condition: 'Partly cloudy', humidity: 78 },
  toolCallId: 'call_8c1e9a4f',
}" [defaultOpen]="true" />`;

  protected readonly streamingCode = `<pk-tool [toolPart]="{
  type: 'web_search',
  state: 'input-streaming',
  input: { query: 'angular signals best p' },
}" />`;

  protected readonly readyCode = `<pk-tool [toolPart]="{
  type: 'list_files',
  state: 'input-available',
  input: { path: './src/app', recursive: true },
}" />`;

  protected readonly errorCode = `<pk-tool [toolPart]="{
  type: 'send_email',
  state: 'output-error',
  input: { to: 'invalid@@example', subject: 'Hello' },
  errorText: 'SMTP rejected: 550 5.1.1 Recipient address invalid.',
}" [defaultOpen]="true" />`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkTool',
      props: [
        {
          name: 'toolPart',
          type: 'ToolPart',
          description: 'Required. { type, state, input?, output?, toolCallId?, errorText? }',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Initial expanded state.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
    {
      name: 'ToolPart',
      props: [
        { name: 'type', type: 'string', description: 'Tool name (e.g. "fetch_weather").' },
        {
          name: 'state',
          type: 'ToolState',
          description:
            '"input-streaming" | "input-available" | "output-available" | "output-error"',
        },
        {
          name: 'input',
          type: 'Record<string, unknown>',
          description: 'Arguments. Pretty-printed in the Input section when present.',
        },
        {
          name: 'output',
          type: 'Record<string, unknown>',
          description: 'Result. JSON-stringified in the Output section.',
        },
        {
          name: 'errorText',
          type: 'string',
          description: 'Error message (only shown for state=output-error).',
        },
        {
          name: 'toolCallId',
          type: 'string',
          description: 'Call ID, displayed at the bottom in monospace.',
        },
      ],
    },
  ];
}
