import { BarcodeScannerService } from './../../../services/barcode-scanner.service';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageData {
  message: string;
  success: boolean;
}
@Component({
  selector: 'app-notifier-popup',
  templateUrl: './notifier-popup.component.html',
  styleUrls: ['./notifier-popup.component.scss'],
})
export class NotifierPopupComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<NotifierPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData,
    private barcodeScanner: BarcodeScannerService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
    this.barcodeScanner.stopListening();
  }

  onDecline() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.barcodeScanner.startListening();
  }
}
