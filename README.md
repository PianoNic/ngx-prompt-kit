# ngx-prompt-kit

[![npm version](https://img.shields.io/npm/v/ngx-prompt-kit?color=c87941)](https://www.npmjs.com/package/ngx-prompt-kit)
[![license](https://img.shields.io/github/license/PianoNic/ngx-prompt-kit?color=c87941)](https://github.com/PianoNic/ngx-prompt-kit/blob/master/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/ngx-prompt-kit?color=c87941)](https://www.npmjs.com/package/ngx-prompt-kit)

Angular components for AI chat interfaces, built on [Spartan UI](https://www.spartan.ng).
Port of [ibelick/prompt-kit](https://github.com/ibelick/prompt-kit).

Distributed via Angular schematics — `ng add` and `ng generate` copy source into your project, where you own the code.

## Install

```bash
ng add ngx-prompt-kit
```

## Add components

```bash
ng generate ngx-prompt-kit:message
ng generate ngx-prompt-kit:prompt-input
ng generate ngx-prompt-kit:markdown
```

See the [full component list](./projects/ngx-prompt-kit/README.md#add-components) for all 20 available components, their helm dependencies, and any extra packages they need.

## Prerequisites

- Angular 19+ (tested on Angular 21)
- Tailwind CSS v4
- [Spartan UI](https://www.spartan.ng) installed in your workspace

## Repo structure

This monorepo contains:

- **`projects/ngx-prompt-kit/`** — the schematic library published to npm
- **`src/`** — the demo app showcasing all components
- **`libs/ui/`** — Spartan UI helm components used by the demo

## Develop locally

```bash
bun install
bun run build:lib    # builds the schematic library to dist/
bun x ng serve       # runs the demo at http://localhost:4200
```

## Credit

Original React implementation by [Julien Thibeaut (ibelick)](https://github.com/ibelick) — MIT-licensed.

## License

MIT
