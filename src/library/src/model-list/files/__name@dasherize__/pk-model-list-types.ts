// ngx-prompt-kit original — not part of ibelick/prompt-kit
// Compatible with the Model interface from pk-model-picker — same shape so consumers
// can share a single Model[] across both components.
export interface Model {
  id: string;
  name: string;
  iconUrl?: string;
  provider?: string;
  /** Inline metadata in the row — parameter size ("8.0B"), context ("128K"), etc. */
  tagline?: string;
  disabled?: boolean;
}
