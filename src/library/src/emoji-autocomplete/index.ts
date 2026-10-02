import { buildComponent } from '../_lib/component-rule';
export const emojiAutocomplete = buildComponent({
  name: 'emoji-autocomplete',
  extraDeps: { gemoji: '^8.1.0' },
});
