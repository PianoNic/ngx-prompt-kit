import { Tree } from '@angular-devkit/schematics';

const CONFIG_FILE = '/components.json';
const DEFAULT_PATH = 'libs/prompt-kit';

export interface PromptKitConfig {
  componentsPath?: string;
}

export interface ComponentsJson {
  promptKit?: PromptKitConfig;
  [key: string]: unknown;
}

export function readComponentsJson(tree: Tree): ComponentsJson {
  if (!tree.exists(CONFIG_FILE)) return {};
  try {
    return JSON.parse(tree.read(CONFIG_FILE)!.toString('utf-8')) as ComponentsJson;
  } catch {
    return {};
  }
}

export function readPromptKitPath(tree: Tree): string | undefined {
  return readComponentsJson(tree).promptKit?.componentsPath;
}

export function resolveComponentPath(tree: Tree, optionsPath?: string): string {
  return optionsPath ?? readPromptKitPath(tree) ?? DEFAULT_PATH;
}

export function writePromptKitConfig(tree: Tree, componentsPath: string): void {
  const existing = readComponentsJson(tree);
  const next: ComponentsJson = {
    ...existing,
    promptKit: {
      ...(existing.promptKit ?? {}),
      componentsPath,
    },
  };
  const serialized = JSON.stringify(next, null, 2) + '\n';
  if (tree.exists(CONFIG_FILE)) {
    tree.overwrite(CONFIG_FILE, serialized);
  } else {
    tree.create(CONFIG_FILE, serialized);
  }
}

export const PROMPT_KIT_DEFAULT_PATH = DEFAULT_PATH;
