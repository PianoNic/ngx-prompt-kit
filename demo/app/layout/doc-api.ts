import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ApiSection {
  name: string;
  props: ApiProp[];
}

@Component({
  selector: 'app-doc-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTableImports],
  template: `
    <section class="mt-12">
      <h2 class="text-xl font-semibold tracking-tight">Component API</h2>
      <div class="mt-4 flex flex-col gap-8">
        @for (section of sections(); track section.name) {
          <div>
            <h3 class="text-sm font-semibold">{{ section.name }}</h3>
            <div hlmTableContainer class="mt-3">
              <table hlmTable>
                <thead hlmTHead>
                  <tr hlmTr>
                    <th hlmTh>Prop</th>
                    <th hlmTh>Type</th>
                    <th hlmTh>Default</th>
                    <th hlmTh>Description</th>
                  </tr>
                </thead>
                <tbody hlmTBody>
                  @for (p of section.props; track p.name) {
                    <tr hlmTr>
                      <td hlmTd class="font-mono text-xs">{{ p.name }}</td>
                      <td hlmTd>
                        <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">{{ p.type }}</code>
                      </td>
                      <td hlmTd class="text-muted-foreground font-mono text-xs">
                        {{ p.default ?? '—' }}
                      </td>
                      <td hlmTd class="text-muted-foreground text-sm">{{ p.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class DocApi {
  public readonly sections = input.required<ApiSection[]>();
}
