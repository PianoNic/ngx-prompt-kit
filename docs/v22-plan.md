# v22 Component Plan — Agent UI Toolkit

> **Deferred from the v21.0.4 session.** Begin only after v21.0.4 has been
> live on npm for several days and has either feedback (issues, PRs) or
> a meaningful download signal. The point of waiting is to learn from
> real usage before adding more API surface; same rule that surfaced
> between v21.0.3 and v21.0.4.

---

## Mission

Add 5 components that move ngx-prompt-kit from "AI chat primitives"
toward "complete agent UI toolkit." These specifically close gaps that
were called out as missing across the entire AI chat library ecosystem
(assistant-ui, CopilotKit, Vercel AI Elements, prompt-kit upstream).

Components — all NEW, ngx-prompt-kit originals:

1. `approval` — action approval prompt for tool execution
2. `attachment-preview` — attached files/images chip row above prompt input
3. `message-actions-bar` — standard action toolbar below assistant messages
4. `branch-nav` — navigate between sibling message versions
5. `model-picker` — model selection dropdown

Mark all five as "ngx-prompt-kit original" everywhere they appear,
same treatment as the v21.0.3 originals.

---

## Workspace state — verify before starting

```
git remote -v        → origin pointing to PianoNic/ngx-prompt-kit
git log --oneline -5 → v21.0.4 release tag visible
type projects\ngx-prompt-kit\package.json → version 21.0.4
```

If v21.0.4 hasn't been live on npm for at least a few days, **stop and
defer further**. The point of waiting is to learn from real usage.

Source of truth: `projects/ngx-prompt-kit/src/<name>/files/__name@dasherize__/`
Dogfood: `src/app/components/prompt-kit/<name>/`
Demos: `src/app/demo/<name>-demo.ts`
Routes: `src/app/app.routes.ts`
Sidebar: `src/app/layout/nav-data.ts`
Component table: `projects/ngx-prompt-kit/README.md`

Dual-write rule applies. Edit schematic source first, then
`bun x ng generate ngx-prompt-kit:<name> --force` to refresh dogfood.

---

## Hard architecture rules (unchanged)

1. Standalone components only. No NgModules.
2. Signal-based: `input()`, `output()`, `model()`, `viewChild()`, `contentChild()`.
3. `ChangeDetectionStrategy.OnPush` everywhere.
4. SSR-safe. Guard `window` / `document` / `clipboard` / `ResizeObserver` /
   `IntersectionObserver` / `requestAnimationFrame` with `isPlatformBrowser`
   or `afterNextRender`.
5. Tailwind v4 utility classes. Spartan helm color tokens only.
6. `pk-` selector prefix, `Pk` class prefix, Component suffix.
7. Strict TypeScript. No `any`, no `@ts-ignore`.
8. Bun only. No npm/pnpm/yarn commands.
9. `posix.join` for Tree paths in schematic rules.

---

## Component specifications

Build in order. Stop after each, screenshots, commit, wait for
greenlight before moving to the next.

### 1. approval — start here

Selector: `pk-approval` (root) + `pk-approval-parameter` (child).
Helm: `button`, `card`, `badge`. ExtraDeps: none.

**API**

```ts
pk-approval
  inputs:
    title         string                              required
    description   string                              optional
    action        string                              e.g. 'execute', 'send', 'delete'
    severity      'info' | 'warning' | 'destructive'  default 'info'
    parameters    readonly ApprovalParameter[]        default []
    approveLabel  string                              default 'Approve'
    rejectLabel   string                              default 'Reject'
    pending       boolean                             default false (disables buttons during async)
  outputs:
    approved      ()
    rejected      ()

pk-approval-parameter (rendered for each ApprovalParameter)
  inputs:
    label     string
    value     string
    truncate  boolean   default true
  Internal child component; consumers don't compose directly unless
  they want custom parameter rendering.

interface ApprovalParameter {
  label: string;
  value: string;
  truncate?: boolean;
}
```

**Behavior**

- Card with severity-tinted left border:
  - `info` → `border-l-primary`
  - `warning` → `border-l-amber-500 dark:border-l-amber-400`
  - `destructive` → `border-l-destructive`
- Title at top (`text-base font-medium`), severity badge to the right
  showing the action verb
- Description below title (`text-sm text-muted-foreground`), optional
- Parameters as label/value rows with monospace value (`font-mono text-xs`)
- Footer with Reject (`variant='ghost'`) and Approve (`variant='default'`
  or `'destructive'` if `severity='destructive'`) buttons, right-aligned
- When `pending` is true: both buttons disabled, Approve shows a spinner
- Keyboard: Enter triggers approve, Esc triggers reject (only when
  component has focus-within)

**Demo (3 examples)**

1. Info: 'Run database query' with 2 parameters (table, limit)
2. Warning: 'Send email to 247 recipients' with parameters
3. Destructive: 'Delete repository' with confirmation parameters and
   explicit destructive button styling

---

### 2. attachment-preview

Selector: `pk-attachment-preview` (root) + `pk-attachment-chip` (item).
Helm: `button`. ExtraDeps: none.

**API**

```ts
pk-attachment-preview
  inputs:
    attachments  readonly Attachment[]   required
    maxVisible   number                  default 0 (0 = show all)
                                         when > 0, surplus collapses to "+N more"
    removable    boolean                 default true
  outputs:
    removed      (id: string)
    clicked      (id: string)            full chip click (for preview/lightbox)

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'audio' | 'video';
  size?: number;          // bytes
  thumbnailUrl?: string;  // for images
  mimeType?: string;
}
```

**Behavior**

- Horizontal scrolling row of chips
- Image type: 40×40 thumbnail (border, `rounded-md`), filename truncated
- File/audio/video: lucide icon (`paperclip` / `music` / `video`) +
  filename + formatted size (e.g., "2.4 MB" via Intl helper)
- Remove button (X) appears top-right corner of chip on hover
  (default to hover-revealed; consumer overrides via class)
- When `maxVisible > 0` and overflow exists, last visible chip is
  replaced with "+N more" pill
- Click on chip body emits `(clicked)` with id; consumer wires preview
- Click on remove button emits `(removed)` with id

**Demo (3 examples)**

1. Mixed types: 1 image with thumbnail + 1 PDF + 1 audio
2. Image-heavy: 4 images in a row
3. With `maxVisible=3` + overflow showing "+5 more"

---

### 3. message-actions-bar

Selector: `pk-message-actions-bar`. Helm: `button`, `tooltip`. ExtraDeps: none.

**API**

```ts
pk-message-actions-bar
  inputs:
    actions      readonly MessageAction[]   required
    visible      'hover' | 'always'         default 'hover'
    orientation  'horizontal' | 'vertical'  default 'horizontal'
  outputs:
    actionPicked  (action: MessageAction)

interface MessageAction {
  id: string;                                // 'copy', 'regenerate', 'thumbs-up', etc.
  label: string;                             // for tooltip + a11y
  icon: string;                              // lucide name
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  active?: boolean;                          // e.g. thumbs-up after click
}
```

**Behavior**

- Renders a row of icon-only ghost buttons with tooltips
- Hover (or focus-within) reveals at parent level when `visible='hover'`
  — uses `opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`
  so consumer wraps in a `group` div containing the message
- When `visible='always'`, no opacity transition
- Active state: button gets `bg-accent` and `text-primary`
- Disabled: standard `hlmBtn` disabled styling
- Vertical orientation flips to `flex-col` for sidebar-style placement

**Built-in helpers (re-exported from index.ts)**

- `DEFAULT_ASSISTANT_ACTIONS`: copy, regenerate, thumbs-up, thumbs-down
- `DEFAULT_USER_ACTIONS`: copy, edit

Each is a `readonly MessageAction[]` consumers can spread + customize:
`[...DEFAULT_ASSISTANT_ACTIONS, { id: 'share', label: 'Share', icon: 'lucideShare2' }]`

**Demo (3 examples)**

1. Assistant message with `DEFAULT_ASSISTANT_ACTIONS`, hover-revealed,
   wired to `(actionPicked)="handleAction($event)"` with console.log
2. User message with `DEFAULT_USER_ACTIONS`
3. Custom action set with active state on thumbs-up after click
   (toggle behavior shown — consumer manages active state)

---

### 4. branch-nav

Selector: `pk-branch-nav`. Helm: `button`. ExtraDeps: none.

**API**

```ts
pk-branch-nav
  inputs:
    current  number   required (1-indexed for display)
    total    number   required
    compact  boolean  default false
  outputs:
    changed  (next: number)   1-indexed
```

**Behavior**

- Compact format: "1 / 3" with prev/next arrow buttons flanking
- Verbose format (compact=false): "Branch 1 of 3" with arrows
- Arrow buttons disable at edges (current=1 disables prev,
  current=total disables next)
- Keyboard: Left/Right arrows navigate when component has focus
- When total=1, component renders nothing

**Demo (2 examples)**

1. Compact mode at "2 / 5" with working navigation (signal-driven)
2. Verbose mode integrated below a `pk-message` bubble showing the
   ChatGPT/Claude.ai-style placement

---

### 5. model-picker

Selector: `pk-model-picker`. Helm: `button`, `dropdown-menu`, `badge`. ExtraDeps: none.

**API**

```ts
pk-model-picker
  inputs:
    models       readonly Model[]    required
    selectedId   string              model() — two-way bindable
    placeholder  string              default 'Select model'
    compact      boolean             default false
  outputs:
    changed      (model: Model)

interface Model {
  id: string;
  name: string;                       // 'Claude Opus 4', 'GPT-5'
  provider?: string;                  // 'Anthropic', 'OpenAI'
  tagline?: string;                   // 'Best for complex reasoning'
  tier?: 'fast' | 'balanced' | 'smart';
  inputPricePer1M?: number;
  outputPricePer1M?: number;
  currency?: string;                  // default 'USD'
  disabled?: boolean;
}
```

**Behavior**

- Trigger button shows selected model's name (and tier badge if set)
- Click opens `hlm-dropdown-menu`
- Dropdown items show: name, provider (small muted), tagline (if set),
  tier badge (if set), pricing line (if input/output prices set —
  formatted "$2.50 / $10.00 per 1M" with locale-aware currency)
- Disabled models grey out and don't fire `(changed)`
- Compact mode: trigger shows only model name with chevron, no provider
- Selected item gets check icon

**Demo (3 examples)**

1. Three models with tiers + pricing — full detail view
2. Compact mode in a horizontal toolbar layout
3. Single example showing disabled model state (e.g., "Coming soon")

---

## Workflow per component

For each of the 5:

1. Create schematic source under `projects/ngx-prompt-kit/src/<name>/`
2. Add `HELM_REQUIREMENTS` entry in `_lib/component-rule.ts`
3. Register in `collection.json` (alphabetical position)
4. Build: `bun run build:lib`
5. Generate dogfood: `bun x ng generate ngx-prompt-kit:<name> --force`
6. Add `tsconfig.json` path alias if needed
7. Add demo route, demo page, sidebar nav entry with `badge: 'New'`
8. Build clean: `bun run build:lib` + `bun x ng build`
9. Take screenshots — both modes, all examples on the demo page
10. Commit: `feat: add <name> component (ngx-prompt-kit original)`
11. Stop and report with screenshots
12. Wait for greenlight before next component

---

## README update (after all 5 are done)

In `projects/ngx-prompt-kit/README.md`, add a new section above the table:

```
## 🆕 New in v22 (or whatever version)

Five components closing the agent-UI toolkit gaps:

- `approval` — action approval prompt for tool execution
- `attachment-preview` — attached files/images above the input
- `message-actions-bar` — standard action toolbar below messages
- `branch-nav` — navigate sibling message versions
- `model-picker` — model selection dropdown
```

Add 🆕 indicator to the 5 new rows in the component table.

---

## Version bump & release

After all 5 commits:

1. Bump version. Two options based on Angular alignment:
   - If still on Angular 21: bump to **21.0.5**
   - If migrating to Angular 22 simultaneously: bump to **22.0.0** (only
     do this if the workspace's Angular deps have actually been bumped;
     don't bump the lib version past Angular's major)
   Default to 21.0.5 unless told otherwise.
2. CHANGELOG entry with the 5 new components + the agent-UI-toolkit framing
3. Commit: `chore: bump to <version>`
4. Push
5. **STOP.** Human creates the GitHub release with `gh release create`.

---

## Anti-patterns

- Don't reimplement primitives that exist in `@spartan-ng/brain`.
- Don't bake in assumptions about specific LLM providers (no hardcoded
  pricing for GPT-4o, Claude, etc. — all consumer-supplied).
- Don't let `approval` and `message-actions-bar` overlap in scope.
  `approval` is a one-shot decision card; `message-actions-bar` is the
  hover-revealed actions on a settled message.
- Don't try to manage actual conversation branching state in `branch-nav`.
  It only renders the navigation UI; consumer manages which branch is current.
- Don't try to manage actual model selection state. `model-picker` reflects
  what consumer passes; consumer wires the actual model switch.

---

## Scope boundaries (don't suggest these)

These were considered for this batch and explicitly skipped:

- `rate-limit-banner`: simple to roll on consumer side
- `conversation-search`: too app-specific
- `share-dialog`: scope creep
- `attachment-gallery`: niche
- `keyboard-shortcuts-dialog`: every app has different shortcuts
- `canvas / artifact panel`: too large for this batch
- `mood-selector`: not in the chat-app default toolkit
- `prompt-templates`: too app-specific

If during implementation one of these naturally emerges from the 5
you're building, flag it — don't silently add it.

---

## Start (for the v22 session)

1. Verify workspace state. If v21.0.4 isn't live on npm with a few days
   of breathing room, stop and tell the user.
2. Begin with `approval` (largest, sets patterns for severity-tinted
   cards and the "ngx-prompt-kit original" treatment).
3. Stop after committing `approval`. Report with screenshots:
   - All 3 examples (info, warning, destructive)
   - Both light and dark mode
   - Confirm border colors render correctly across modes
4. Wait for visual greenlight before starting `attachment-preview`.
