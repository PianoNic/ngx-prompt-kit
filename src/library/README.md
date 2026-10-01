# <p align="center">ngx-prompt-kit</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/PianoNic/ngx-prompt-kit/master/assets/icon.svg" width="120" alt="ngx-prompt-kit logo">
</p>

<p align="center">
  <strong>Angular components for AI chat interfaces, built on Spartan UI.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ngx-prompt-kit"><img src="https://img.shields.io/npm/v/ngx-prompt-kit?color=white" alt="npm version"/></a>
  <a href="https://github.com/PianoNic/ngx-prompt-kit/blob/master/LICENSE"><img src="https://img.shields.io/github/license/PianoNic/ngx-prompt-kit?color=white"/></a>
  <a href="https://www.npmjs.com/package/ngx-prompt-kit"><img src="https://img.shields.io/npm/dm/ngx-prompt-kit?color=white" alt="npm downloads"/></a>
</p>

<p align="center">
  <a href="https://ngx-prompt-kit.pianonic.ch">Live Demo</a>
</p>

## About

Port of [ibelick/prompt-kit](https://github.com/ibelick/prompt-kit) to Angular. Components for building AI chat UIs — chat turns, a composer, streaming responses, markdown rendering, code blocks, and more.

Distributed via Angular schematics: `ng add` and `ng generate` copy source into your project, where you own and edit the code. No runtime dependency on this package after generation.

## Features

- **Schematic-based** — Source lands in your project, no version-pinning hell
- **Spartan UI native** — Built on the brain and helm primitives you already use
- **Signal-based** — `input()`, `output()`, `model()`, `viewChild()` throughout
- **OnPush by default** — Every component uses `ChangeDetectionStrategy.OnPush`
- **SSR-safe** — All browser APIs guarded with `isPlatformBrowser` / `afterNextRender`
- **Tailwind v4** — Utility-first styling, no CSS-in-JS
- **Accessible** — ARIA labels, keyboard navigation, focus management
- **Standalone** — No NgModules, just import and use
- **Tree-shakeable** — Add only the components you use

## Prerequisites

- Angular 21 or 22 (tested on Angular 22)
- Node.js 22.22.3+, 24.15+ or 26+
- Tailwind CSS v4
- [Spartan UI](https://www.spartan.ng) installed in your workspace

## Installation

```bash
ng add ngx-prompt-kit
```

## Configure install path (optional)

```bash
ng generate ngx-prompt-kit:init
```

Prompts for an install path and persists it to `components.json` under `promptKit.componentsPath`. Skip this step and components default to `libs/prompt-kit`.

## Add components

```bash
ng generate ngx-prompt-kit:composer
ng generate ngx-prompt-kit:chat-turn
ng generate ngx-prompt-kit:markdown
```

Components land at `libs/prompt-kit/<name>/` by default. Override per command with `--path=<dir>` or set a workspace-wide path via `ng generate ngx-prompt-kit:init`. The `cn()` utility lands alongside automatically.

### Bulk install

Pick from a checklist:

```bash
ng generate ngx-prompt-kit:ui
```

Or skip the prompt:

```bash
ng generate ngx-prompt-kit:ui --components=composer,chat-turn,markdown
```

| Component                | Helm dependencies                         | Other deps    |
| ------------------------ | ----------------------------------------- | ------------- |
| `approval`               | badge, button, card, spinner              | —             |
| `attachment-preview`     | attachment                                | —             |
| `auth-image`             | skeleton                                  | —             |
| `branch-nav`             | button                                    | —             |
| `chain-of-thought`       | — (brain collapsible)                     | —             |
| `chain-of-thought-steps` | spinner                                   | shiki, marked |
| `chat-container`         | —                                         | —             |
| `chat-turn`              | bubble, button                            | —             |
| `code-block`             | —                                         | shiki         |
| `composer`               | button, textarea                          | —             |
| `conversation-list`      | button, dropdown-menu, input              | —             |
| `cost-display`           | —                                         | —             |
| `feedback-bar`           | button                                    | —             |
| `file-upload`            | —                                         | —             |
| `image`                  | skeleton                                  | —             |
| `markdown`               | —                                         | marked        |
| `message-actions-bar`    | button, tooltip                           | —             |
| `message-edit`           | button, dropdown-menu, textarea           | —             |
| `model-browser`          | input-group                               | —             |
| `model-list`             | input-group                               | —             |
| `model-picker`           | badge, button, dropdown-menu, input-group | —             |
| `model-selector`         | button, input-group, sheet                | —             |
| `prompt-suggestion`      | button                                    | —             |
| `reasoning`              | — (brain collapsible)                     | —             |
| `response-stream`        | —                                         | —             |
| `source`                 | hover-card                                | —             |
| `steps`                  | — (brain collapsible)                     | —             |
| `stream-controls`        | button                                    | —             |
| `thinking-bar`           | — (spartan `shimmer` utility)             | —             |
| `todo-list`              | — (brain collapsible)                     | —             |
| `token-counter`          | progress                                  | —             |
| `tool`                   | badge, spinner                            | —             |
| `tool-steps`             | —                                         | shiki         |
| `usage-card`             | avatar, button, card, progress, tooltip   | —             |

### Use spartan/ui directly for these

Earlier versions shipped components that spartan/ui now covers. They were removed; reach for the spartan helm component instead:

| Removed          | Use instead                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `loader`         | `hlm-spinner`, or the `shimmer` utility for text                   |
| `text-shimmer`   | the `shimmer` utility from spartan's tailwind preset               |
| `scroll-button`  | an `hlmBtn` calling `pk-chat-container-root`'s `scrollToBottom()`  |
| `message`        | `hlm-message` with `hlm-bubble` and `hlm-avatar` (+ `pk-markdown`) |
| `system-message` | `hlm-alert`                                                        |
| `chat-empty`     | `hlm-empty`                                                        |
| `prompt-input`   | `hlm-input-group` with `hlmInputGroupTextarea`, or `pk-composer`   |

Helm prerequisites must be installed separately via Spartan's CLI:

```bash
ng g @spartan-ng/cli:ui
```

## Usage

```typescript
import { Component, signal } from '@angular/core';
import { PkComposerImports } from 'libs/prompt-kit/composer';

@Component({
  selector: 'app-chat',
  imports: [PkComposerImports],
  template: `
    <pk-composer-dock variant="card">
      <pk-composer [(value)]="value" (submitted)="onSubmit($event)" placeholder="Ask anything..." />
    </pk-composer-dock>
  `,
})
export class Chat {
  protected readonly value = signal('');
  protected onSubmit(text: string): void {
    console.log('submitted:', text);
  }
}
```

See the [live demo](https://ngx-prompt-kit.pianonic.ch) for every component with code snippets.

## Notes

- Re-running a component schematic overwrites the existing files. If you've customized them, commit your changes first.
- You own the generated source — edit freely. Updates to this package won't push changes to your code.
- `image` uses Angular's `NgOptimizedImage` directive when given a real `src` URL; falls back to a native `<img>` for base64/blob payloads.
- `cost-display` does **not** bundle model pricing tables — those drift constantly. Pass `inputPricePer1M` / `outputPricePer1M` from your own source of truth.

## Credit

Original React implementation by [Julien Thibeaut (ibelick)](https://github.com/ibelick) — MIT-licensed.

## License

MIT
