# ngx-prompt-kit

Angular components for AI chat interfaces, built to compose with [Spartan UI](https://www.spartan.ng).
Port of [ibelick/prompt-kit](https://github.com/ibelick/prompt-kit).

Components are distributed via Angular schematics — `ng add` and `ng generate` copy source into your project, where you own the code.

## Prerequisites

- Angular 19+ (tested on Angular 21)
- Tailwind CSS v4
- [Spartan UI](https://www.spartan.ng) installed in your workspace

## Setup

One-time bootstrap (installs `clsx` and `tailwind-merge`, checks for Spartan):

```bash
ng add ngx-prompt-kit
```

## Add components

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

Add a component:

```bash
ng generate ngx-prompt-kit:message
```

Components land in `<sourceRoot>/app/components/prompt-kit/<name>/`. The `cn()` utility is auto-generated alongside.

Helm prerequisites must be installed separately via Spartan's CLI:

```bash
ng g @spartan-ng/cli:ui
```

## Coverage

All components from [ibelick/prompt-kit](https://github.com/ibelick/prompt-kit) are available, except `jsx-preview` (React-specific, no clean Angular equivalent).

## Notes

- Re-running a component schematic overwrites the existing files. If you've customized them, commit your changes first.
- You own the generated source — edit freely. We won't push updates to your code.
- `image` internally uses Angular's [`NgOptimizedImage`](https://angular.dev/api/common/NgOptimizedImage) directive when given a real `src` URL; falls back to a native `<img>` for base64/blob payloads (NgOptimizedImage doesn't accept `data:` URLs).

## Credit

Original React implementation by [Julien Thibeaut (ibelick)](https://github.com/ibelick) — MIT-licensed.

## License

MIT
