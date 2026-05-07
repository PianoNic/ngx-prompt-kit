import { strings } from '@angular-devkit/core';
import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  template,
  url,
} from '@angular-devkit/schematics';

export interface UtilsSchema {
  project?: string;
  path?: string;
}

export function utils(options: UtilsSchema): Rule {
  return () => {
    const targetPath = options.path ?? 'libs/prompt-kit';
    const tpl = apply(url(`../utils/files`), [
      template({ ...strings, name: 'utils' }),
      move(targetPath),
    ]);
    return mergeWith(tpl, MergeStrategy.AllowCreationConflict);
  };
}
