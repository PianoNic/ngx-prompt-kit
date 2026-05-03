import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

interface NgAddOptions {
  skipHelmCheck?: boolean;
}

const UNIVERSAL_DEPS: Record<string, string> = {
  clsx: '^2.1.1',
  'tailwind-merge': '^3.5.0',
};

const REQUIRED_HELM_HINT = `
prompt-kit-ng components compose Spartan UI helm components.
If you haven't already, run:

  ng g @spartan-ng/cli:ui

and select at minimum: avatar, button, textarea, tooltip
`;

export function ngAdd(_options: NgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = '/package.json';
    if (!tree.exists(pkgPath)) {
      throw new Error('No package.json found at workspace root.');
    }
    const pkg = JSON.parse(tree.read(pkgPath)!.toString('utf-8'));
    pkg.dependencies = pkg.dependencies ?? {};
    let changed = false;
    for (const [name, version] of Object.entries(UNIVERSAL_DEPS)) {
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

    if (!_options.skipHelmCheck) {
      const hasSpartan =
        pkg.dependencies?.['@spartan-ng/brain'] ||
        pkg.devDependencies?.['@spartan-ng/brain'];
      if (!hasSpartan) {
        context.logger.warn('⚠  @spartan-ng/brain not found in package.json.');
        context.logger.warn(REQUIRED_HELM_HINT);
      } else {
        context.logger.info('✓ Spartan brain detected.');
      }
    }

    context.logger.info('');
    context.logger.info('prompt-kit-ng is ready. Add components with:');
    context.logger.info('  ng generate @pianonic/prompt-kit-ng:<component>');

    return tree;
  };
}
