// ngx-prompt-kit original — not part of ibelick/prompt-kit

/** One emoji under one of its shortcodes, e.g. `{ emoji: '😭', shortcode: 'sob' }`. */
export interface EmojiMatch {
  emoji: string;
  shortcode: string;
}

/** The shortcode being typed: `:so` with the caret right after it. */
export interface EmojiToken {
  /** Index of the opening colon. */
  start: number;
  /** Index of the caret, where the token ends. */
  end: number;
  /** What follows the colon, lowercased: `so`. */
  query: string;
}

/** Every shortcode, `[shortcode, emoji]`, in gemoji's order. */
export type EmojiIndex = readonly (readonly [string, string])[];

let index: Promise<EmojiIndex> | undefined;

/**
 * GitHub's emoji list (gemoji), loaded on first call through a dynamic import so it stays out of
 * the initial bundle. Later calls share the same promise.
 */
export function loadEmojiIndex(): Promise<EmojiIndex> {
  index ??= import('gemoji').then(({ gemoji }) =>
    gemoji.flatMap(({ emoji, names }) => names.map((name) => [name, emoji] as const)),
  );
  return index;
}

const TOKEN = /(?:^|\s):([a-z0-9_+-]*)$/i;
const COMPLETE = /(?:^|\s):([a-z0-9_+-]+):$/i;

/**
 * The `:query` right before the caret, when the colon starts the text or follows whitespace and at
 * least `minChars` shortcode characters follow it. `null` otherwise.
 */
export function findEmojiToken(text: string, caret: number, minChars = 2): EmojiToken | null {
  const before = text.slice(0, caret);
  const match = TOKEN.exec(before);
  if (!match || match[1].length < minChars) return null;
  return { start: caret - match[1].length - 1, end: caret, query: match[1].toLowerCase() };
}

/** A whole `:shortcode:` right before the caret (the closing colon just typed), or `null`. */
export function findCompleteShortcode(
  text: string,
  caret: number,
): { start: number; end: number; shortcode: string } | null {
  const match = COMPLETE.exec(text.slice(0, caret));
  if (!match) return null;
  return {
    start: caret - match[1].length - 2,
    end: caret,
    shortcode: match[1].toLowerCase(),
  };
}

/**
 * Up to `limit` emoji for `query`: shortcodes that start with it first (shortest first), then
 * ones that contain it. Each emoji appears once, under its best-matching shortcode.
 */
export function searchEmoji(emojiIndex: EmojiIndex, query: string, limit = 8): EmojiMatch[] {
  const q = query.toLowerCase();
  const prefix: (readonly [string, string])[] = [];
  const contains: (readonly [string, string])[] = [];
  for (const entry of emojiIndex) {
    const at = entry[0].indexOf(q);
    if (at === 0) prefix.push(entry);
    else if (at > 0) contains.push(entry);
  }
  const byLength = (a: readonly [string, string], b: readonly [string, string]) =>
    a[0].length - b[0].length || (a[0] < b[0] ? -1 : 1);
  prefix.sort(byLength);
  contains.sort(byLength);

  const seen = new Set<string>();
  const out: EmojiMatch[] = [];
  for (const [shortcode, emoji] of [...prefix, ...contains]) {
    if (seen.has(emoji)) continue;
    seen.add(emoji);
    out.push({ emoji, shortcode });
    if (out.length >= limit) break;
  }
  return out;
}

/** The emoji for an exact shortcode, or `undefined`. */
export function emojiForShortcode(emojiIndex: EmojiIndex, shortcode: string): string | undefined {
  return emojiIndex.find(([name]) => name === shortcode)?.[1];
}
