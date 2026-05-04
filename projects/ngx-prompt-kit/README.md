# <p align="center">ngx-prompt-kit</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/PianoNic/ngx-prompt-kit/master/public/icon.svg" width="120" alt="ngx-prompt-kit logo">
</p>

<p align="center">
  <strong>Angular components for AI chat interfaces, built on Spartan UI.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ngx-prompt-kit"><img src="https://img.shields.io/npm/v/ngx-prompt-kit?color=c87941" alt="npm version"/></a>
  <a href="https://github.com/PianoNic/ngx-prompt-kit/blob/master/LICENSE"><img src="https://img.shields.io/github/license/PianoNic/ngx-prompt-kit?color=c87941"/></a>
  <a href="https://www.npmjs.com/package/ngx-prompt-kit"><img src="https://img.shields.io/npm/dm/ngx-prompt-kit?color=c87941" alt="npm downloads"/></a>
</p>

<p align="center">
  <a href="https://ngx-prompt-kit.pianonic.ch">Live Demo</a>
</p>

## About

Port of [ibelick/prompt-kit](https://github.com/ibelick/prompt-kit) to Angular. 20 components for building AI chat UIs — message threads, prompt input, streaming responses, markdown rendering, code blocks, and more.

Distributed via Angular schematics: `ng add` and `ng generate` copy source into your project, where you own and edit the code. No runtime dependency on this package after generation.

## Features

- **20 components** - Full parity with the React lineup (jsx-preview omitted)
- **Schematic-based** - Source lands in your project, no version-pinning hell
- **Spartan UI native** - Composes with the helm primitives you already use
- **Signal-based** - `input()`, `output()`, `model()`, `viewChild()` throughout
- **OnPush by default** - Every component uses `ChangeDetectionStrategy.OnPush`
- **SSR-safe** - All browser APIs guarded with `isPlatformBrowser` / `afterNextRender`
- **Tailwind v4** - Utility-first styling, no CSS-in-JS
- **Accessible** - ARIA labels, keyboard navigation, focus management
- **Standalone** - No NgModules, just import and use
- **Tree-shakeable** - Add only the components you use

## Prerequisites

- Angular 19+ (tested on Angular 21)
- Tailwind CSS v4
- [Spartan UI](https://www.spartan.ng) installed in your workspace

## Installation

```bash
ng add ngx-prompt-kit
```

## 🆕 New in v21.0.3

Components new to ngx-prompt-kit (not part of the upstream React library):

- `conversation-list` — chat history sidebar with date grouping
- `token-counter` — character/token display for input
- `stream-controls` — stop while streaming, regenerate after
- `chat-empty` — landing state with suggestion grid
- `cost-display` — locale-aware running cost for an LLM exchange
- `message-edit` — inline edit for user messages

## Add components

```bash
ng generate ngx-prompt-kit:message
ng generate ngx-prompt-kit:prompt-input
ng generate ngx-prompt-kit:markdown
```

Components land at `<sourceRoot>/app/components/prompt-kit/<name>/`. The `cn()` utility lands alongside automatically.

| Component             | Helm dependencies              | Other deps |
|-----------------------|--------------------------------|------------|
| `chain-of-thought`    | icon                           | —          |
| `chat-container`      | —                              | —          |
| `chat-empty` 🆕       | card                           | —          |
| `code-block`          | —                              | shiki      |
| `conversation-list` 🆕 | button, separator, dropdown-menu | —        |
| `cost-display` 🆕     | —                              | —          |
| `feedback-bar`        | icon                           | —          |
| `file-upload`         | —                              | —          |
| `image`               | —                              | —          |
| `loader`              | —                              | —          |
| `markdown`            | —                              | marked     |
| `message`             | avatar, tooltip                | —          |
| `message-edit` 🆕     | button, textarea               | —          |
| `prompt-input`        | textarea, tooltip              | —          |
| `prompt-suggestion`   | button                         | —          |
| `reasoning`           | —                              | —          |
| `response-stream`     | —                              | —          |
| `scroll-button`       | button                         | —          |
| `source`              | hover-card                     | —          |
| `steps`               | icon                           | —          |
| `stream-controls` 🆕   | button                         | —          |
| `system-message`      | button, icon                   | —          |
| `text-shimmer`        | —                              | —          |
| `thinking-bar`        | icon                           | —          |
| `token-counter` 🆕    | —                              | —          |
| `tool`                | icon                           | —          |

🆕 = ngx-prompt-kit original (not in upstream prompt-kit)

Helm prerequisites must be installed separately via Spartan's CLI:

```bash
ng g @spartan-ng/cli:ui
```

## Usage

```typescript
import { Component, signal } from '@angular/core';
import { PkPromptInputImports } from './components/prompt-kit/prompt-input';

@Component({
  selector: 'app-chat',
  imports: [PkPromptInputImports],
  template: `
    <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
      <pk-prompt-input-textarea placeholder="Ask anything..." />
    </pk-prompt-input>
  `,
})
export class Chat {
  protected readonly value = signal('');
  protected onSubmit(): void {
    console.log('submitted:', this.value());
  }
}
```

See the [live demo](https://ngx-prompt-kit.pianonic.ch) for every component with code snippets.

## Notes

- Re-running a component schematic overwrites the existing files. If you've customized them, commit your changes first.
- You own the generated source — edit freely. Updates to this package won't push changes to your code.
- `image` uses Angular's `NgOptimizedImage` directive when given a real `src` URL; falls back to a native `<img>` for base64/blob payloads.
- `cost-display` does **not** bundle model pricing tables — those drift constantly (GPT-4o was $5/1M six months ago, $2.50/1M now). Pass `inputPricePer1M` / `outputPricePer1M` from your own source of truth. Currency conversion is also out of scope: convert before passing in if your API charges in one currency and you display in another.

## Credit

Original React implementation by [Julien Thibeaut (ibelick)](https://github.com/ibelick) — MIT-licensed.

## License

MIT
