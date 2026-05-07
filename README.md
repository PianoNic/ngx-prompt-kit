# <p align="center">ngx-prompt-kit</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/PianoNic/ngx-prompt-kit/master/public/icon.svg" width="120" alt="ngx-prompt-kit logo">
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

## Configure install path (optional)

```bash
ng generate ngx-prompt-kit:init
```

Prompts for an install path and persists it to `components.json` under `promptKit.componentsPath`. Skip this step and components default to `libs/prompt-kit`.

## Add components

```bash
ng generate ngx-prompt-kit:message
ng generate ngx-prompt-kit:prompt-input
ng generate ngx-prompt-kit:markdown
```

Components land at `libs/prompt-kit/<name>/` by default. Override per command with `--path=<dir>` or set a workspace-wide path via `ng generate ngx-prompt-kit:init`. The `cn()` utility lands alongside automatically.

| Component           | Helm dependencies   | Other deps |
|---------------------|---------------------|------------|
| `chain-of-thought`  | icon                | —          |
| `chat-container`    | —                   | —          |
| `code-block`        | —                   | shiki      |
| `feedback-bar`      | icon                | —          |
| `file-upload`       | —                   | —          |
| `image`             | —                   | —          |
| `loader`            | —                   | —          |
| `markdown`          | —                   | marked     |
| `message`           | avatar, tooltip     | —          |
| `prompt-input`      | textarea, tooltip   | —          |
| `prompt-suggestion` | button              | —          |
| `reasoning`         | —                   | —          |
| `response-stream`   | —                   | —          |
| `scroll-button`     | button              | —          |
| `source`            | hover-card          | —          |
| `steps`             | icon                | —          |
| `system-message`    | button, icon        | —          |
| `text-shimmer`      | —                   | —          |
| `thinking-bar`      | icon                | —          |
| `tool`              | icon                | —          |

Helm prerequisites must be installed separately via Spartan's CLI:

```bash
ng g @spartan-ng/cli:ui
```

## Usage

```typescript
import { Component, signal } from '@angular/core';
import { PkPromptInputImports } from 'libs/prompt-kit/prompt-input';

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

## Credit

Original React implementation by [Julien Thibeaut (ibelick)](https://github.com/ibelick) — MIT-licensed.

## License

MIT
