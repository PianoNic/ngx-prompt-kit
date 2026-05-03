import { strings } from '@angular-devkit/core';
import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { posix } from 'path';

export interface UtilsSchema {
  project?: string;
  path?: string;
}

export function utils(options: UtilsSchema): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);
    const projectName =
      options.project ??
      (workspace.extensions['defaultProject'] as string | undefined) ??
      workspace.projects.keys().next().value;
    if (!projectName) {
      throw new SchematicsException(
        'No Angular project specified and none found in angular.json.',
      );
    }
    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found.`);
    }
    const defaultPath = buildDefaultPath(project as never);
    const targetPath = options.path ?? posix.join(defaultPath, 'components', 'prompt-kit');
    const tpl = apply(url(`../utils/files`), [
      template({ ...strings, name: 'utils' }),
      move(targetPath),
    ]);
    return mergeWith(tpl, MergeStrategy.AllowCreationConflict);
  };
}
