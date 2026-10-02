import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { PkComposerImports } from 'ngx-prompt-kit/composer';
import { PkEmojiAutocompleteImports, type EmojiMatch } from 'ngx-prompt-kit/emoji-autocomplete';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';

@Component({
  selector: 'app-emoji-autocomplete-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    HlmInputGroupImports,
    NgIcon,
    PkComposerImports,
    PkEmojiAutocompleteImports,
  ],
  providers: [provideIcons({ lucideArrowUp })],
  template: `
    <app-doc-page
      title="Emoji Autocomplete"
      [original]="true"
      description="Discord-style emoji shortcodes for a prompt box. Type a colon and two letters (:so) and a list of matching emoji opens above the box; the arrow keys move the highlight, Enter or Tab puts the emoji in place of what you typed, Escape closes the list. A whole :sob: turns into its emoji on the closing colon. While the list is open it takes Enter, so picking an emoji never sends the message. The emoji list (GitHub's gemoji) loads the first time a shortcode is typed."
    >
      <app-doc-example
        title="On a composer"
        description="Put pkEmojiAutocomplete on pk-composer; it finds the composer's text box. Try :so, then Enter: the emoji goes in and nothing is sent. Enter again sends."
        [code]="composerCode"
      >
        <div class="flex min-h-[420px] flex-col justify-end gap-4">
          <div class="rounded-2xl border bg-background px-3 pt-2 pb-3 mx-auto max-w-2xl">
            <pk-composer
              pkEmojiAutocomplete
              placeholder="Type :so to pick an emoji"
              [(value)]="draft"
              (submitted)="sent.set($event)"
              (emojiInserted)="inserted.set($event)"
            />
          </div>
          <p class="text-muted-foreground text-xs" aria-live="polite">
            (submitted): <span class="text-foreground font-mono">{{ sent() || '—' }}</span>
            · (emojiInserted):
            <span class="text-foreground font-mono">{{
              inserted() ? inserted()!.emoji + ' :' + inserted()!.shortcode + ':' : '—'
            }}</span>
          </p>
        </div>
      </app-doc-example>

      <app-doc-example
        title="On a spartan input group"
        description="Any element holding a textarea works, or the textarea itself. Here the directive sits on the hlmInputGroup, so the list lines up with the whole group."
        [code]="inputGroupCode"
      >
        <div class="flex min-h-[380px] flex-col justify-end">
          <div
            hlmInputGroup
            pkEmojiAutocomplete
            [maxResults]="6"
            class="mx-auto max-w-2xl rounded-3xl"
          >
            <textarea
              hlmInputGroupTextarea
              class="px-4 pt-3"
              placeholder="Message"
              aria-label="Message"
              [value]="groupDraft()"
              (input)="groupDraft.set($any($event.target).value)"
            ></textarea>
            <div hlmInputGroupAddon align="block-end" class="justify-end px-3 pb-3">
              <button
                hlmBtn
                size="icon-sm"
                type="button"
                class="rounded-full"
                aria-label="Send message"
              >
                <ng-icon name="lucideArrowUp" />
              </button>
            </div>
          </div>
        </div>
      </app-doc-example>

      <app-doc-install component="emoji-autocomplete" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class EmojiAutocompleteDemo {
  protected readonly draft = signal('');
  protected readonly sent = signal('');
  protected readonly inserted = signal<EmojiMatch | null>(null);
  protected readonly groupDraft = signal('');

  protected readonly composerCode = `import { PkEmojiAutocompleteImports } from 'libs/prompt-kit/emoji-autocomplete';

<pk-composer
  pkEmojiAutocomplete
  [(value)]="draft"
  (submitted)="send($event)"
  (emojiInserted)="onEmoji($event)"
/>`;

  protected readonly inputGroupCode = `<div hlmInputGroup pkEmojiAutocomplete [maxResults]="6">
  <textarea hlmInputGroupTextarea aria-label="Message" ...></textarea>
  ...
</div>

<!-- or straight on the text box -->
<textarea pkEmojiAutocomplete aria-label="Message"></textarea>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkEmojiAutocomplete',
      props: [
        {
          name: 'pkEmojiAutocomplete',
          type: 'directive',
          description:
            'On a <textarea> or <input>, or on an element containing one (pk-composer, an hlmInputGroup). The list opens above that element and matches its width. exportAs "pkEmojiAutocomplete".',
        },
        {
          name: 'maxResults',
          type: 'number',
          default: '8',
          description:
            'Most rows shown. Shortcodes that start with the query come first, shortest first, then ones that contain it.',
        },
        {
          name: 'minChars',
          type: 'number',
          default: '2',
          description: 'Characters after the colon before the list opens.',
        },
        {
          name: 'emojiAutocompleteDisabled',
          type: 'boolean',
          default: 'false',
          description: 'Turns the autocomplete off.',
        },
        {
          name: 'emojiInserted',
          type: 'output<EmojiMatch>',
          description:
            'Fires with { emoji, shortcode } when an emoji goes in, picked from the list or typed as a whole :shortcode:.',
        },
        {
          name: 'open',
          type: 'Signal<boolean>',
          description:
            'The list is showing. While it is, Enter, Tab, Escape and the arrow keys go to the list, not the text box.',
        },
        {
          name: 'insert(match) / dismiss()',
          type: 'method',
          description: 'Insert a match in place of the typed shortcode, or close the list.',
        },
      ],
    },
    {
      name: 'Helpers',
      props: [
        {
          name: 'loadEmojiIndex()',
          type: 'Promise<EmojiIndex>',
          description: 'Lazy-loads gemoji once and lists every [shortcode, emoji] pair.',
        },
        {
          name: 'searchEmoji(index, query, limit?)',
          type: 'EmojiMatch[]',
          description: 'The ranking the list uses, for your own pickers.',
        },
      ],
    },
  ];
}
