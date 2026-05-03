# HANDOFF — ngx-prompt-kit

Durable record before context compaction. Scan this first in any future session.

## Project state

- **Repo name (target)**: `ngx-prompt-kit`
- **npm package name (current)**: `@pianonic/ngx-prompt-kit` (scoped)
- **npm package name (TARGET)**: `ngx-prompt-kit` (unscoped, matches `ngx-m3-calendar` pattern). **NOT YET DONE — drop the `@pianonic/` scope as part of pre-publish.**
- **Workspace path (current)**: `C:\Coding\prompt-kit-ng\prompt-kit-ng\` (outer folder still old name; rename to `C:\Coding\ngx-prompt-kit\` LAST after git work is done — Windows file-handle quirks).
- **Inner library folder**: `projects/ngx-prompt-kit/` ✓ (renamed from `prompt-kit-ng/`).
- **Branch**: `master`
- **HEAD commit**: `dde0f98 fix(message): apply bubble styles to host element, drop the wrapping div` (or later — pull `git log --oneline | head -1` to confirm).
- **Working tree**: 176 staged-or-untracked files from the rename batch sed. NOT yet committed. The rename should be committed as one commit (proposed message: `chore: rename to ngx-prompt-kit`).

## Architecture

**Schematic-based distribution.** Consumers run `ng add ngx-prompt-kit` once (universal deps + Spartan check), then `ng generate ngx-prompt-kit:<component>` per component. Source lands in their project under `<sourceRoot>/app/components/prompt-kit/<name>/`. They own and edit it from there. No runtime-bundled component library.

**Source of truth**: `projects/ngx-prompt-kit/src/<name>/files/__name@dasherize__/` — the schematic templates that get copied verbatim into the consumer's project.

**Dogfood copy**: `src/app/components/prompt-kit/<name>/` — the same components, generated INTO this repo via `ng generate ngx-prompt-kit:<name>` and consumed by the demo app to validate the schematic output. **Must stay in sync** with the schematic source — every fix to a component requires updating BOTH locations.

**20 components shipped** (only `jsx-preview` omitted, React-specific):

```
chain-of-thought  chat-container    code-block        feedback-bar
file-upload       image             loader            markdown
message           prompt-input      prompt-suggestion reasoning
response-stream   scroll-button     source            steps
system-message    text-shimmer      thinking-bar      tool
```

Plus `utils` (the `cn()` helper, auto-chained by every component schematic).

**Helm requirements per component** (in `_lib/component-rule.ts`):
- `message`: avatar, tooltip
- `prompt-input`: textarea, tooltip
- `prompt-suggestion` / `scroll-button`: button
- `system-message`: button, icon
- `thinking-bar` / `feedback-bar` / `steps` / `chain-of-thought` / `tool`: icon
- `source`: hover-card

## Done (closing commit)

| Phase | What | Closing commit |
|---|---|---|
| Original 12 ports | message, markdown, code-block, prompt-input, response-stream, loader, chat-container, scroll-button, prompt-suggestion, file-upload, reasoning + utils | `aa904af` |
| Schematic conversion | ng-packagr abandoned; converted to schematic distribution with collection.json + per-component factories | `9eeb11e` |
| 9 additional components | chain-of-thought, feedback-bar, image, source, steps, system-message, text-shimmer, thinking-bar, tool | `278eb86` |
| Demo pages for original 11 | DocPage / DocExample / DocInstall / DocApi pattern | (woven into landing/shell phase) |
| Demo pages for 9 new | same pattern | `fbf0daf` (with later avatar cleanup) |
| Sidebar shell | persistent left aside (desktop), hlm-sheet from left (mobile) with custom sticky header | `2555cd9` + `471d903` |
| Landing page | hero with live PromptInput + code preview, 6 feature cards, footer | `5e17378` and later polish |
| Installation page | Prerequisites / Spartan / ng add / ng generate / Usage with Bun/npm/ng tabs (default ng) | `cc1c154` |
| App icon | chevron mark on near-black squircle, dark-mode aware | `4e41049` |
| Bug bash | steps clipping, source hover-card service injection, message bubble host-binding, loader keyframes + encapsulation, text-shimmer background-clip | `f652749` / `f7907f6` / `ece9440` / `5f6c8f4` |
| **Rename to ngx-prompt-kit** | folder rename + global sed | **PENDING COMMIT** (working tree dirty) |

## Remaining work (in order)

### Pre-publish

1. ~~Commit the rename~~ — done in `83c005a`.
2. ~~Drop `@pianonic/` scope~~ — done. Package is unscoped `ngx-prompt-kit` everywhere; `--access public` flag dropped from publish.yml.
3. **C.2 — history scrub**. Rewrite every commit to remove:
   - `Co-Authored-By:` trailers
   - `🤖 Generated with...` / "Generated with [Claude Code]" footers
   - Any reference to Claude / Anthropic / AI in commit messages
   - Use `git filter-repo --message-callback` or interactive rebase
   - Verify: `git log --pretty=format:"%h %an <%ae> %s%n%b" | findstr /i "co-author claude anthropic generated"` returns nothing
   - Also scrub README, `.claude/`, `AGENTS.md`, code comments — author should be `PianoNic` only everywhere
4. **C.3 — artifact cleanup**:
   - `.reference/` is gitignored; confirm not in any commit's history (was added once, removed in `38e352c` — verify it's not deeper in the rewritten history after C.2)
   - `.claude/` directory — internal Claude Code state, must not ship
   - `AGENTS.md` at root — Angular 21 auto-generated, delete or scrub
   - `.vscode/settings.json` if it has personal paths (extensions.json is fine)
   - `.playwright-mcp/` directory — should be gitignored, currently NOT (lots of artifacts in there)
   - Throwaway test workspace `C:\Coding\prompt-kit-ng-test\` is OUTSIDE this repo — leave it
   - Run `git ls-files | findstr /v "^projects ^src ^scripts ^.github ^public"` to spot anything weird
5. **C.4 — verify builds clean post-cleanup**:
   ```
   bun run build:lib
   bun x ng build
   ```
6. **C.5 — push public**:
   ```
   gh repo create PianoNic/ngx-prompt-kit --public --source=. --remote=origin --push
   ```
   Or if exists private: `gh repo edit PianoNic/ngx-prompt-kit --visibility public`. Then push (force-with-lease if history rewritten).
7. **Outer workspace folder rename**: `C:\Coding\prompt-kit-ng\` → `C:\Coding\ngx-prompt-kit\`. Do this LAST.

### Human-only steps

8. Run Spartan helm CLI in the test workspace (interactive, can't be scripted) to complete the C.7 verification from way back.
9. Verify `ngx-prompt-kit` is available on npmjs.com.
10. Configure npm Trusted Publisher (link `PianoNic/ngx-prompt-kit` repo + `publish.yml` workflow on npmjs.com).
11. First GitHub release: tag `v0.1.0`, publish, watch the workflow run.
12. Real-consumer smoke test in a fresh Angular workspace.

### v0.1.1 (post-launch)

- `/blocks` page (currently `ComingSoon` stub) — recipe blocks combining 2-4 components
- `/showcase/full-chat` page (currently `ComingSoon` stub) — the ambitious full-app composition
- Real per-page polish, dark-mode visual audit
- Optional: per-component visual regression tests

## Decisions and gotchas

- **Selectors stay `pk-`, class names stay `Pk`**. Not renamed during rebrand. Short cosmetic prefix; renaming would force every consumer to regenerate.
- **`display: block` on `pk-message-content` is NOT a bug.** Element is a flex item of `pk-message`; CSS spec blockifies flex items (`inline-block` → `block`). The `inline-block` class is correctly applied; the cascade is correct; flexbox just rewrites the used value. Bubbles render correctly.
- **chain-of-thought**: consumers must set `[last]="true"` on the final step manually. React used `React.Children.cloneElement` to mark it automatically; no clean Angular equivalent. Explicit prop is the simpler trade.
- **image component** is dual-mode: NgOptimizedImage when `[src]` is a real URL (Angular handles lazy-loading + priority), native `<img>` for `[base64]` / `[uint8Array]` payloads (NgOptimizedImage doesn't accept `data:` URLs).
- **source component**: provided `BrnHoverCardContentService` directly on `pk-source` because content projection breaks the NodeInjector chain to BrnHoverCard's host. Without this provider, `pk-source-content` throws NG0201.
- **message bubble**: bubble styling MUST be on the host (via `host: { '[class]': 'computedClass()' }`), not on a wrapping div. The wrapping-div approach left the host with the consumer's `class="bg-primary"` static attribute filling a SQUARE behind the rounded inner div.
- **steps & reasoning**: max-height transition wrapper. Padding/border MUST go on the inner content (via `contentClass`) so they're clipped when the wrapper collapses to 0px. Earlier ghost-line bug came from `pb-1` on the wrapper.
- **mobile sheet**: `side="left"` belongs on `<hlm-sheet>` (extends BrnSheet which owns the input), NOT on `<hlm-sheet-content>`. Default close button overlaps content; we hide it with `[showCloseButton]="false"` and ship a custom sticky header.
- **schematics**:
  - Use `template()` (not `applyTemplates()`). `applyTemplates` only acts on `.template`-suffixed paths; `template()` does both content + path token rewriting.
  - `MergeStrategy.AllowCreationConflict` for the chained `utils` schematic (so re-running components doesn't error on existing `cn.ts`).
  - `MergeStrategy.Overwrite` for component templates (re-running gives the latest).
  - Tree paths use `path.posix.join` (forward slashes regardless of OS).
- **loader / response-stream / text-shimmer**: `ViewEncapsulation.None` on the component so the global `@keyframes` aren't scoped (Angular's emulated encapsulation rewrites keyframe names).
- **text-shimmer**: use `[style.background-image]` not `[style.background]` shorthand — the shorthand resets `background-clip` and breaks the text-clip effect.
- **Library uses Bun** for build, `bun x` for ng commands. Documented in installation page with three-tab Bun/npm/ng selector (default: ng).

## Conventions (every component MUST follow)

- Standalone components only. No NgModules.
- Signal-based API: `input()`, `output()`, `model()`, `viewChild()`, `contentChild()`. No `@Input` / `@Output` decorators.
- `ChangeDetectionStrategy.OnPush` everywhere.
- SSR-safe: every browser API (`window`, `document`, `clipboard`, `ResizeObserver`, `IntersectionObserver`, `requestAnimationFrame`) guarded behind `isPlatformBrowser(inject(PLATFORM_ID))` or `afterNextRender()`.
- Strict TypeScript: no `any`, no `@ts-ignore`, no non-null assertions without comment.
- Tailwind v4 utility classes only. Use existing Spartan helm color tokens (`bg-background`, `text-foreground`, `border-border`, etc.) — do NOT introduce new color tokens.
- `pk-` selector prefix. `Pk` class name prefix. `Component` suffix on the class.
- Bun only. Never use `npm install`, `pnpm`, `yarn` in the source / docs.

## Repo layout (essential files only)

```
.github/workflows/publish.yml        npm Trusted Publishing on release
.gitignore                           dist/, node_modules/, .angular/, .reference/
angular.json                         demo app + ngx-prompt-kit library project
package.json                         root scripts: build:lib, build:lib:assets, format
public/icon.svg                      brand chevron mark
scripts/copy-schematic-assets.js    copies collection.json + schemas + files/ trees to dist
src/                                  demo app (consumer perspective)
  app/
    app.routes.ts                    20 component routes + landing + installation + 2 stubs
    components/prompt-kit/<name>/    DOGFOOD source (generated by schematic)
    demo/<name>-demo.ts              per-component demo pages
    layout/                          Shell, SidebarNav, ThemeToggle, DocPage, DocExample, DocInstall, DocApi, DocNav
    pages/                           Landing, Installation, ComingSoon
projects/ngx-prompt-kit/              SCHEMATIC LIBRARY (the source of truth)
  package.json                       publishable metadata (currently @pianonic/ngx-prompt-kit, drop scope)
  README.md                          consumer-facing docs
  ng-package.json                    dest = ../../dist/ngx-prompt-kit
  tsconfig.json                       schematic compilation config
  src/
    collection.json                  registers all schematics
    ng-add/                          one-time bootstrap
    _lib/component-rule.ts           shared factory builder (HELM_REQUIREMENTS lives here)
    utils/                           cn() helper schematic
    <component>/                     one folder per component
      index.ts                       schematic factory (one-liner using buildComponent)
      schema.json                    project + path inputs
      files/__name@dasherize__/      template files copied to consumer
tsconfig.json                         path aliases: ngx-prompt-kit/<name> → src/app/components/prompt-kit/<name>
```

## Most-likely-to-edit files in next phase (C.2 / C.3)

- `.git/` history (via `git filter-repo` or `git rebase -i`) for C.2
- `.gitignore` to add `.claude/`, `.playwright-mcp/`, dev artifacts
- `HANDOFF.md` itself if state changes mid-cleanup
- `projects/ngx-prompt-kit/package.json` for the scope drop
- `projects/ngx-prompt-kit/README.md` and `src/app/pages/installation.ts` for install-command snippets after scope drop
- `_lib/component-rule.ts` for the `externalSchematic('@pianonic/...', ...)` call

## Useful commands

```bash
# Library build (rebuilds dist/ngx-prompt-kit)
bun run build:lib

# Demo build
bun x ng build

# Demo dev server
bun x ng serve --port 4200

# Find any leftover old name references
grep -rln "prompt-kit-ng" --include="*.ts" --include="*.json" --include="*.md" \
   --include="*.yml" --include="*.js" --include="*.html" --include="*.svg" \
   2>/dev/null | grep -v node_modules | grep -v dist | grep -v .reference \
   | grep -v .angular | grep -v .playwright-mcp | grep -v .git

# Find any leftover @pianonic scope
grep -rln "@pianonic" --include="*.ts" --include="*.json" --include="*.md" \
   --include="*.yml" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v .git

# Check git log for AI/co-author trailers
git log --pretty=format:"%h %an <%ae> %s%n%b" | findstr /i "co-author claude anthropic generated"

# Spot weird tracked files
git ls-files | findstr /v "^projects ^src ^scripts ^.github ^public"
```
