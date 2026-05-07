import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { resolveComponentPath } from '../_lib/config';

export interface UtilsSchema {
  project?: string;
  path?: string;
}

export function utils(options: UtilsSchema): Rule {
  return (tree: Tree) => {
    const targetPath = resolveComponentPath(tree, options.path);
    const tpl = apply(url(`../utils/files`), [
      applyTemplates({ ...strings, name: 'utils' }),
      move(targetPath),
    ]);
    return mergeWith(tpl, MergeStrategy.AllowCreationConflict);
  };
}
