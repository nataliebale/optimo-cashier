import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogPopupData {
  title: string | TemplateRef<any>;
  message: string | TemplateRef<any>;
  approveLabel?: string;
  declineLabel?: string;
  hideClose?: boolean;
}

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPopupData
  ) {}

  onDecline(): void {
    this.dialogRef.close(false);
  }

  onApprove(): void {
    this.dialogRef.close(true);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
