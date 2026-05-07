import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FILE_UPLOAD_STATE } from './file-upload.state';

@Component({
  selector: 'pk-file-upload-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="class()" (click)="onClick($event)">
      <ng-content />
    </button>
  `,
})
export class PkFileUploadTrigger {
  public readonly class = input<string>('');
  private readonly state = inject(FILE_UPLOAD_STATE);

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.state.openPicker();
  }
}
