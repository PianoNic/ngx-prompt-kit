import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../utils/cn';
import { FILE_UPLOAD_STATE } from './file-upload.state';

@Component({
  selector: 'pk-file-upload-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div [class]="computedClass()">
        <ng-content />
      </div>
    }
  `,
})
export class PkFileUploadContent {
  public readonly class = input<string>('');
  private readonly state = inject(FILE_UPLOAD_STATE);

  protected readonly visible = computed(() => this.state.isDragging() && !this.state.disabled());
  protected readonly computedClass = computed(() =>
    cn(
      'bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm',
      this.class(),
    ),
  );
}
