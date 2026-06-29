import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { PROMPT_KIT_DEFAULT_PATH, readPromptKitPath, writePromptKitConfig } from '../_lib/config';

export interface InitSchema {
  path?: string;
}

export function init(options: InitSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const requested = options.path?.trim();
    const componentsPath = requested && requested.length > 0 ? requested : PROMPT_KIT_DEFAULT_PATH;

    const previous = readPromptKitPath(tree);
    writePromptKitConfig(tree, componentsPath);

    if (previous && previous !== componentsPath) {
      context.logger.info(`✓ Updated promptKit.componentsPath: ${previous} → ${componentsPath}`);
    } else if (previous === componentsPath) {
      context.logger.info(
        `✓ promptKit.componentsPath already set to ${componentsPath} in components.json`,
      );
    } else {
      context.logger.info(
        `✓ Wrote promptKit.componentsPath = ${componentsPath} to components.json`,
      );
    }
    context.logger.info('');
    context.logger.info('Add components with:');
    context.logger.info('  ng generate ngx-prompt-kit:<component>');
    context.logger.info(`They will land at ${componentsPath}/<component>.`);

    return tree;
  };
}
