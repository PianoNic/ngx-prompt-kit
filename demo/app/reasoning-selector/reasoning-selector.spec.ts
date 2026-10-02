import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PkReasoningSelector } from 'ngx-prompt-kit/reasoning-selector';

@Component({
  imports: [PkReasoningSelector],
  template: `<pk-reasoning-selector [(value)]="level" />`,
})
class Host {
  readonly level = signal<string | null>('medium');
}

function menuItems(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')];
}

describe('PkReasoningSelector', () => {
  afterEach(() => document.querySelector('.cdk-overlay-container')?.replaceChildren());

  it('names the trigger after the selected level', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Reasoning: Balanced');
  });

  it('falls back to Auto for null and unknown values', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.level.set('unknown');
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Reasoning: Auto');
  });

  it('lists the levels as radio items and writes the picked one back', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    const items = menuItems();
    expect(items.map((item) => item.textContent?.trim().split(/\s+/)[0])).toEqual([
      'Auto',
      'Off',
      'Light',
      'Balanced',
      'Deep',
      'Maximum',
    ]);
    expect(items[3].getAttribute('aria-checked')).toBe('true');

    items[4].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.level()).toBe('high');

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    menuItems()[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.level()).toBeNull();
  });
});
