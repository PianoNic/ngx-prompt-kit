import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkUsageCardImports } from 'ngx-prompt-kit/usage-card';

const AVATAR = (a: string, b: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

@Component({
  selector: 'app-usage-card-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkUsageCardImports],
  template: `
    <app-doc-page
      title="Usage Card"
      [original]="true"
      description="Persistent session/account-level usage indicator. Three display modes — ring (Instagram/Discord pattern, usage IS the chrome), inline (sidebar header row), and card (standalone block, JetBrains AI widget pattern). All share threshold colors at 75/90/100% and identity-integrated by design."
    >
      <app-doc-example
        title="Ring — identity-integrated"
        description="Default mode. Circular SVG arc wraps the avatar; name + sublabel stack to the right. Most compact mode — hover for the full readout."
        [code]="ringCode"
      >
        <pk-usage-card
          [used]="2_500"
          [limit]="10_000"
          [avatar]="avatarA"
          name="Niclas"
          sublabel="Pro plan"
        />
      </app-doc-example>

      <app-doc-example
        title="Inline — sidebar header row"
        description="Horizontal layout for sidebar headers. Avatar + name + sublabel + readout on top, fill bar below. Numbers visible at a glance — use this when ring is too small for the readout to be useful."
        [code]="inlineCode"
      >
        <div class="border-border bg-background w-full max-w-sm rounded-md border p-3">
          <pk-usage-card
            display="inline"
            [used]="30_000"
            [limit]="50_000"
            [avatar]="avatarB"
            name="Niclas"
            sublabel="Resets in 12 days"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Card — standalone block with top-up"
        description="Full hlm-card chrome, label header, fill bar, count, optional Top-up button. The button only renders when [topUpLabel] is set — no dead CTAs. 88% usage trips the amber threshold."
        [code]="cardCode"
      >
        <div class="w-full max-w-sm">
          <pk-usage-card
            display="card"
            [used]="44_000"
            [limit]="50_000"
            label="Token usage"
            unit="tokens"
            topUpLabel="Top up"
            [avatar]="avatarA"
            name="Niclas"
            sublabel="Pro plan"
            (topUpClicked)="onTopUp()"
          />
          @if (lastEvent(); as e) {
            <p class="text-muted-foreground mt-2 text-xs">
              Last event: <span class="text-foreground font-mono">{{ e }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Threshold trio — ring colors at 30 / 85 / 105 %"
        description="Three rings side-by-side at the muted, amber, and destructive thresholds. Easiest way to verify the traffic-light state in both themes."
        [code]="trioCode"
      >
        <div class="flex flex-wrap items-start gap-8">
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="3_000"
              [limit]="10_000"
              [avatar]="avatarA"
              [ringSize]="56"
              [ringStroke]="3.5"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">30%</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="8_500"
              [limit]="10_000"
              [avatar]="avatarB"
              [ringSize]="56"
              [ringStroke]="3.5"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">85%</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="10_500"
              [limit]="10_000"
              [avatar]="avatarC"
              [ringSize]="56"
              [ringStroke]="3.5"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">105%</span>
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Monochrome — opt out of threshold colors"
        description="Set [monochrome]='true' to drop the traffic-light entirely. Ring stroke, bar fill, and number text all use the foreground color (near-white in dark, near-black in light). Useful when usage is informational rather than actionable — no warning state needed."
        [code]="monoCode"
      >
        <div class="flex flex-wrap items-start gap-8">
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="3_000"
              [limit]="10_000"
              [avatar]="avatarA"
              [ringSize]="56"
              [ringStroke]="3.5"
              [monochrome]="true"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">30%</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="8_500"
              [limit]="10_000"
              [avatar]="avatarB"
              [ringSize]="56"
              [ringStroke]="3.5"
              [monochrome]="true"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">85%</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <pk-usage-card
              [used]="10_500"
              [limit]="10_000"
              [avatar]="avatarC"
              [ringSize]="56"
              [ringStroke]="3.5"
              [monochrome]="true"
            />
            <span class="text-muted-foreground text-[10px] uppercase tracking-wider">105%</span>
          </div>
        </div>
      </app-doc-example>

      <app-doc-install component="usage-card" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class UsageCardDemo {
  protected readonly avatarA = AVATAR('#7c3aed', '#ec4899');
  protected readonly avatarB = AVATAR('#0ea5e9', '#10b981');
  protected readonly avatarC = AVATAR('#f59e0b', '#dc2626');

  protected readonly lastEvent = signal<string | null>(null);

  protected onTopUp(): void {
    this.lastEvent.set('topUpClicked');
    console.log('[usage-card demo] top-up requested');
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkUsageCard',
      props: [
        { name: 'used', type: 'number', description: 'Current usage value (required).' },
        {
          name: 'limit',
          type: 'number | null',
          description:
            'Cap. Required prop, but null/0 degrades gracefully — bar/ring hide and the readout shows just the used count + unit.',
        },
        {
          name: 'display',
          type: '"ring" | "inline" | "card"',
          default: '"ring"',
          description:
            'ring: SVG arc wrapping the avatar (most compact). inline: sidebar header row with bar + readout. card: standalone hlm-card with label, bar, count, optional top-up.',
        },
        { name: 'avatar', type: 'string?', description: 'Image URL or data URI; falls back to initials.' },
        { name: 'name', type: 'string?', description: 'Display name. Drives initials fallback when avatar is absent.' },
        { name: 'sublabel', type: 'string?', description: 'Smaller muted line under name — plan tier, reset window, etc.' },
        { name: 'label', type: 'string', default: '"Usage"', description: 'Used in card mode header, tooltip, and aria-label.' },
        { name: 'unit', type: 'string', default: '"tokens"', description: 'Trailing unit when the bar is hidden (limit unset).' },
        { name: 'showPercentage', type: 'boolean', default: 'true', description: 'Append "· N%" to the readout.' },
        { name: 'locale', type: 'string?', description: 'BCP-47 locale for Intl.NumberFormat. Defaults to runtime locale.' },
        { name: 'ringSize', type: 'number', default: '40', description: 'Ring + avatar diameter in px (ring mode only).' },
        { name: 'ringStroke', type: 'number', default: '2.5', description: 'Ring stroke width in px (ring mode only).' },
        {
          name: 'topUpLabel',
          type: 'string | null',
          default: 'null',
          description:
            "Card mode only. Set to a label string to render the Top-up button. Null hides it entirely — no dead CTA when consumers haven't wired anything.",
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'topUpClicked',
          type: '() => void',
          description: 'Fires when the Top-up button is clicked. Only emits if topUpLabel is set (button is rendered).',
        },
      ],
    },
  ];

  protected readonly ringCode = `<pk-usage-card
  [used]="2_500"
  [limit]="10_000"
  [avatar]="avatarUrl"
  name="Niclas"
  sublabel="Pro plan"
/>`;

  protected readonly inlineCode = `<pk-usage-card
  display="inline"
  [used]="30_000"
  [limit]="50_000"
  [avatar]="avatarUrl"
  name="Niclas"
  sublabel="Resets in 12 days"
/>`;

  protected readonly cardCode = `<pk-usage-card
  display="card"
  [used]="44_000"
  [limit]="50_000"
  label="Token usage"
  unit="tokens"
  topUpLabel="Top up"
  [avatar]="avatarUrl"
  name="Niclas"
  sublabel="Pro plan"
  (topUpClicked)="onTopUp()"
/>`;

  protected readonly trioCode = `<pk-usage-card [used]="3_000"  [limit]="10_000" [avatar]="a" [ringSize]="56" [ringStroke]="3.5" />
<pk-usage-card [used]="8_500"  [limit]="10_000" [avatar]="b" [ringSize]="56" [ringStroke]="3.5" />
<pk-usage-card [used]="10_500" [limit]="10_000" [avatar]="c" [ringSize]="56" [ringStroke]="3.5" />`;

  protected readonly monoCode = `<pk-usage-card
  [used]="3_000"
  [limit]="10_000"
  [avatar]="avatarUrl"
  [ringSize]="56"
  [ringStroke]="3.5"
  [monochrome]="true"
/>`;
}
