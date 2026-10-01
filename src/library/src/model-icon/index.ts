import { normalize } from '@angular-devkit/core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { buildComponent, type ComponentSchema } from '../_lib/component-rule';
import { resolveComponentPath } from '../_lib/config';

export interface ModelIconSchema extends ComponentSchema {
  /** Folder the icons are copied to; it must be one the app serves as static files. */
  assetsPath?: string;
}

const DEFAULT_ASSETS_PATH = 'public/model-icons';
const DEFAULT_ICON_BASE = "const ICON_BASE = '/model-icons';";

/**
 * The URL the app serves `assetsPath` at: `public/` and `src/` are the static roots of Angular
 * projects (`public/model-icons` → `/model-icons`, `src/assets/model-icons` → `/assets/model-icons`).
 */
export function iconBaseUrl(assetsPath: string): string {
  const path = normalize(assetsPath).replace(/^\/+|\/+$/g, '');
  return '/' + path.replace(/^(public|src)\//, '');
}

/** Copies the icon set (with SOURCES.md) and points the helper's ICON_BASE at it. */
function addIcons(options: ModelIconSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const assetsPath = options.assetsPath ?? DEFAULT_ASSETS_PATH;
    const base = iconBaseUrl(assetsPath);
    context.logger.info(`ℹ  model icons → ${assetsPath} (served at ${base})`);

    const helper = `${resolveComponentPath(tree, options.path)}/model-icon/model-icon.ts`;
    if (base !== '/model-icons' && tree.exists(helper)) {
      const source = tree.read(helper)!.toString('utf-8');
      tree.overwrite(helper, source.replace(DEFAULT_ICON_BASE, `const ICON_BASE = '${base}';`));
    }

    return mergeWith(
      apply(url('../model-icon/assets'), [move(assetsPath)]),
      MergeStrategy.Overwrite,
    );
  };
}

export function modelIcon(options: ModelIconSchema): Rule {
  return chain([buildComponent({ name: 'model-icon' })(options), addIcons(options)]);
}
