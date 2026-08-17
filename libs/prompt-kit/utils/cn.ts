import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes, last-wins on conflicts.
 *
 * Functionally identical to `hlm()` from `@spartan-ng/helm/utils`. Deliberately kept local:
 * the `utils` schematic ships this file into consumer projects, so prompt-kit's class merging
 * must not depend on which helm primitives a consumer happens to have generated.
 *
 * For new host-class bindings prefer `classes()` from `@spartan-ng/helm/utils` over
 * `host: { '[class]': '…' }` — it merges with consumer-supplied classes instead of
 * overwriting them, and suppresses the hydration transition flash.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
