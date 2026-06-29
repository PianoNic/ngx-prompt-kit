/**
 * pk-tool — collapsible visualization for an agent tool-call.
 *
 * Inputs:
 *   toolPart:     ToolPart (required) — { type, state, input?, output?, toolCallId?, errorText? }
 *   defaultOpen:  boolean — initial expanded state (default false)
 *   class:        string
 *
 * Mirrors React's prompt-kit Tool component.
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideCircleCheck,
  lucideCircleX,
  lucideLoader,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

export type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

export interface ToolPart {
  type: string;
  state: ToolState;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  toolCallId?: string;
  errorText?: string;
}

interface BadgeStyle {
  label: string;
  classes: string;
}

const BADGE: Record<ToolState, BadgeStyle> = {
  'input-streaming': {
    label: 'Processing',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  'input-available': {
    label: 'Ready',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  'output-available': {
    label: 'Completed',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  'output-error': {
    label: 'Error',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

@Component({
  selector: 'pk-tool',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideCircleCheck,
      lucideCircleX,
      lucideLoader,
      lucideSettings,
    }),
  ],
  template: `
    <div [class]="containerClass()">
      <div [attr.data-state]="isOpen() ? 'open' : 'closed'">
        <button
          type="button"
          (click)="toggle()"
          class="bg-background h-auto w-full justify-between rounded-b-none px-3 py-2 font-normal flex items-center transition-colors hover:bg-muted/50"
        >
          <div class="flex items-center gap-2">
            <ng-icon hlm size="sm" [name]="iconName()" [class]="iconColor()" />
            <span class="font-mono text-sm font-medium">{{ toolPart().type }}</span>
            <span [class]="badgeClass()">{{ badgeLabel() }}</span>
          </div>
          <ng-icon
            hlm
            size="xs"
            name="lucideChevronDown"
            class="transition-transform"
            [class.rotate-180]="isOpen()"
          />
        </button>

        <div
          [class]="contentWrapperClass()"
          [style.maxHeight]="isOpen() ? maxHeightPx() + 'px' : '0px'"
        >
          <div #inner class="bg-background space-y-3 p-3 border-t border-border">
            @if (hasInput()) {
              <div>
                <h4 class="text-muted-foreground mb-2 text-sm font-medium">Input</h4>
                <div class="bg-background rounded border p-2 font-mono text-sm">
                  @for (entry of inputEntries(); track entry.key) {
                    <div class="mb-1">
                      <span class="text-muted-foreground">{{ entry.key }}:</span>
                      <span> {{ entry.value }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            @if (toolPart().output; as out) {
              <div>
                <h4 class="text-muted-foreground mb-2 text-sm font-medium">Output</h4>
                <div
                  class="bg-background max-h-60 overflow-auto rounded border p-2 font-mono text-sm"
                >
                  <pre class="whitespace-pre-wrap">{{ formatValue(out) }}</pre>
                </div>
              </div>
            }

            @if (toolPart().state === 'output-error' && toolPart().errorText) {
              <div>
                <h4 class="mb-2 text-sm font-medium text-red-500">Error</h4>
                <div
                  class="bg-background rounded border border-red-200 p-2 text-sm dark:border-red-950 dark:bg-red-900/20"
                >
                  {{ toolPart().errorText }}
                </div>
              </div>
            }

            @if (toolPart().state === 'input-streaming') {
              <div class="text-muted-foreground text-sm">Processing tool call...</div>
            }

            @if (toolPart().toolCallId; as id) {
              <div class="text-muted-foreground border-t border-blue-200 pt-2 text-xs">
                <span class="font-mono">Call ID: {{ id }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PkTool implements AfterViewInit {
  public readonly toolPart = input.required<ToolPart>();
  public readonly defaultOpen = input<boolean>(false);
  public readonly class = input<string>('');

  protected readonly isOpen = signal<boolean>(false);

  private readonly inner = viewChild<ElementRef<HTMLDivElement>>('inner');
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly maxHeightPx = signal<number>(0);

  constructor() {
    effect(() => {
      this.isOpen.set(this.defaultOpen());
    });
    effect(() => {
      this.isOpen();
      this.measure();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const el = this.inner?.()?.nativeElement;
    if (!el) return;
    const observer = new ResizeObserver(() => this.measure());
    observer.observe(el);
    this.destroyRef.onDestroy(() => observer.disconnect());
    this.measure();
  }

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  protected readonly containerClass = computed(() =>
    cn('border-border mt-3 overflow-hidden rounded-lg border', this.class()),
  );

  protected readonly contentWrapperClass = computed(
    () => 'overflow-hidden transition-[max-height] duration-150 ease-out',
  );

  protected readonly iconName = computed(() => {
    switch (this.toolPart().state) {
      case 'input-streaming':
        return 'lucideLoader';
      case 'input-available':
        return 'lucideSettings';
      case 'output-available':
        return 'lucideCircleCheck';
      case 'output-error':
        return 'lucideCircleX';
      default:
        return 'lucideSettings';
    }
  });

  protected readonly iconColor = computed(() => {
    switch (this.toolPart().state) {
      case 'input-streaming':
        return 'text-blue-500 animate-spin';
      case 'input-available':
        return 'text-orange-500';
      case 'output-available':
        return 'text-green-500';
      case 'output-error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  });

  protected readonly badgeLabel = computed(() => BADGE[this.toolPart().state].label);
  protected readonly badgeClass = computed(
    () => `px-2 py-1 rounded-full text-xs font-medium ${BADGE[this.toolPart().state].classes}`,
  );

  protected readonly hasInput = computed(() => {
    const i = this.toolPart().input;
    return !!i && Object.keys(i).length > 0;
  });
  protected readonly inputEntries = computed(() => {
    const i = this.toolPart().input ?? {};
    return Object.entries(i).map(([key, value]) => ({ key, value: this.formatValue(value) }));
  });

  protected formatValue(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }

  private measure(): void {
    const el = this.inner?.()?.nativeElement;
    if (el) this.maxHeightPx.set(el.scrollHeight);
  }
}
