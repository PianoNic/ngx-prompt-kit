import {
  chain,
  externalSchematic,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { isKnownComponent, PROMPT_KIT_COMPONENTS } from './components';

export interface UiSchema {
  components?: string[] | string;
  path?: string;
  project?: string;
}

function normalizeComponents(input: UiSchema['components']): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ui(options: UiSchema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const requested = normalizeComponents(options.components);

    if (requested.length === 0) {
      context.logger.warn(
        '⚠  No components selected. Re-run with --components or pick at least one in the prompt.',
      );
      return;
    }

    const unknown = requested.filter((c) => !isKnownComponent(c));
    if (unknown.length > 0) {
      throw new SchematicsException(
        `Unknown component(s): ${unknown.join(', ')}.\n` +
          `Known: ${PROMPT_KIT_COMPONENTS.join(', ')}`,
      );
    }

    const passthrough: Record<string, string | undefined> = {};
    if (options.path) passthrough['path'] = options.path;
    if (options.project) passthrough['project'] = options.project;

    context.logger.info(`▶ Installing ${requested.length} component(s):`);
    for (const c of requested) context.logger.info(`  - ${c}`);
    context.logger.info('');

    return chain(
      requested.map((name) =>
        externalSchematic('ngx-prompt-kit', name, { ...passthrough }),
      ),
    );
  };
}
