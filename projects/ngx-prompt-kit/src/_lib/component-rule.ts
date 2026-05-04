import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { join, posix } from 'path';

export interface ComponentSchema {
  project?: string;
  path?: string;
}

export interface ComponentSpec {
  /** Component folder name, matches the schematic name and the `files/` directory. */
  name: string;
  /** Chain the `utils` schematic before laying down templates. */
  needsUtils?: boolean;
  /** Extra runtime npm deps to add to the consumer's package.json. */
  extraDeps?: Record<string, string>;
}

const HELM_REQUIREMENTS: Record<string, string[]> = {
  message: ['avatar', 'tooltip'],
  'prompt-input': ['textarea', 'tooltip'],
  'prompt-suggestion': ['button'],
  'scroll-button': ['button'],
  'system-message': ['button', 'icon'],
  'thinking-bar': ['icon'],
  'feedback-bar': ['icon'],
  steps: ['icon'],
  'chain-of-thought': ['icon'],
  tool: ['icon'],
  source: ['hover-card'],
  'conversation-list': ['button', 'separator', 'dropdown-menu'],
  'stream-controls': ['button'],
  'chat-empty': ['card'],
  'message-edit': ['button', 'textarea', 'dropdown-menu'],
  approval: ['button', 'card', 'badge'],
  'attachment-preview': ['button'],
};

function resolveProjectName(
  workspace: Awaited<ReturnType<typeof getWorkspace>>,
  requested: string | undefined,
): string {
  if (requested) return requested;
  const fromExtension = workspace.extensions['defaultProject'] as string | undefined;
  if (fromExtension) return fromExtension;
  // Fallback: first project in the workspace (Angular 17+ removed defaultProject).
  const first = workspace.projects.keys().next();
  if (first.done) {
    throw new SchematicsException(
      'No Angular project specified and none found in angular.json.',
    );
  }
  return first.value;
}

export function buildComponent(spec: ComponentSpec): (opts: ComponentSchema) => Rule {
  return (options: ComponentSchema) => {
    return async (tree: Tree, context: SchematicContext) => {
      const workspace = await getWorkspace(tree);
      const projectName = resolveProjectName(workspace, options.project);
      const project = workspace.projects.get(projectName);
      if (!project) {
        throw new SchematicsException(`Project "${projectName}" not found.`);
      }

      const defaultPath = buildDefaultPath(project as never);
      const targetPath =
        options.path ?? posix.join(defaultPath, 'components', 'prompt-kit');

      const helmReqs = HELM_REQUIREMENTS[spec.name];
      if (helmReqs) {
        context.logger.info(
          `ℹ  ${spec.name} requires Spartan helm: ${helmReqs.join(', ')}`,
        );
        context.logger.info(
          `   Install with: ng g @spartan-ng/cli:ui   (select ${helmReqs.join(', ')})`,
        );
      }

      if (spec.extraDeps) {
        const pkgPath = '/package.json';
        if (tree.exists(pkgPath)) {
          const pkg = JSON.parse(tree.read(pkgPath)!.toString('utf-8'));
          pkg.dependencies = pkg.dependencies ?? {};
          let changed = false;
          for (const [name, version] of Object.entries(spec.extraDeps)) {
            if (!pkg.dependencies[name] && !pkg.devDependencies?.[name]) {
              pkg.dependencies[name] = version;
              changed = true;
              context.logger.info(`✓ Added ${name}@${version}`);
            }
          }
          if (changed) {
            tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
            context.addTask(new NodePackageInstallTask());
          }
        }
      }

      const templateSource = apply(url(`../${spec.name}/files`), [
        template({ ...strings, name: spec.name }),
        move(targetPath),
      ]);

      const rules: Rule[] = [];
      if (spec.needsUtils) {
        rules.push(
          externalSchematic('ngx-prompt-kit', 'utils', { project: projectName }),
        );
      }
      rules.push(mergeWith(templateSource, MergeStrategy.Overwrite));

      return chain(rules);
    };
  };
}

// Re-export `join` so consumers/tests can verify path semantics if needed.
export { join };
