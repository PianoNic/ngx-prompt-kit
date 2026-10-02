import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  findCompleteShortcode,
  findEmojiToken,
  PkEmojiAutocomplete,
  searchEmoji,
  type EmojiIndex,
} from 'ngx-prompt-kit/emoji-autocomplete';

const INDEX: EmojiIndex = [
  ['smile', '😄'],
  ['sob', '😭'],
  ['soccer', '⚽'],
  ['sos', '🆘'],
  ['grinning_sob', '🥲'],
  ['so_sob', '😭'],
];

describe('emoji search', () => {
  it('finds a token after a colon at the start or after whitespace', () => {
    expect(findEmojiToken(':so', 3)).toEqual({ start: 0, end: 3, query: 'so' });
    expect(findEmojiToken('hi :So', 6)).toEqual({ start: 3, end: 6, query: 'so' });
    expect(findEmojiToken('hi :s', 5)).toBeNull();
    expect(findEmojiToken('at 10:so', 8)).toBeNull();
    expect(findEmojiToken('http://so', 9)).toBeNull();
  });

  it('ranks prefix matches before contains matches, each emoji once', () => {
    expect(searchEmoji(INDEX, 'so').map((m) => m.shortcode)).toEqual([
      'sob',
      'sos',
      'soccer',
      'grinning_sob',
    ]);
    expect(searchEmoji(INDEX, 'so', 2)).toHaveLength(2);
  });

  it('finds a whole shortcode closed by a colon', () => {
    expect(findCompleteShortcode('hey :sob:', 9)).toEqual({ start: 4, end: 9, shortcode: 'sob' });
    expect(findCompleteShortcode('10:30:', 6)).toBeNull();
  });
});

@Component({
  imports: [PkEmojiAutocomplete],
  template: `<textarea
    pkEmojiAutocomplete
    aria-label="Message"
    [value]="value()"
    (input)="value.set($any($event.target).value)"
    (keydown.enter)="sent.set(true)"
  ></textarea>`,
})
class Host {
  readonly value = signal('');
  readonly sent = signal(false);
}

async function type(
  fixture: { whenStable(): Promise<unknown> },
  box: HTMLTextAreaElement,
  text: string,
) {
  box.focus();
  box.value = text;
  box.setSelectionRange(text.length, text.length);
  box.dispatchEvent(new InputEvent('input', { data: text.at(-1), bubbles: true }));
  // The emoji list loads through a dynamic import.
  for (let i = 0; i < 20 && !document.querySelector('[role="option"]'); i++) {
    await new Promise((resolve) => setTimeout(resolve, 25));
    await fixture.whenStable();
  }
}

describe('PkEmojiAutocomplete', () => {
  afterEach(() => document.querySelector('.cdk-overlay-container')?.replaceChildren());

  it('lists matches, and Enter inserts the emoji instead of sending', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const box = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(box.getAttribute('aria-autocomplete')).toBe('list');

    await type(fixture, box, 'hi :sob');
    const options = [...document.querySelectorAll('[role="option"]')];
    expect(options[0].textContent).toContain(':sob:');
    expect(box.getAttribute('aria-activedescendant')).toBe(options[0].id);

    box.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('hi 😭');
    expect(fixture.componentInstance.sent()).toBe(false);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});
