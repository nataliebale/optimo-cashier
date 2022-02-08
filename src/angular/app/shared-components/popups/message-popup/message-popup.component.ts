import { BarcodeScannerService } from './../../../services/barcode-scanner.service';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageData {
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessagePopupComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<MessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData,
    private barcodeScanner: BarcodeScannerService
  ) {}

  ngOnInit() {
    this.barcodeScanner.stopListening();
  }

  approve(value) {
    this.dialogRef.close(value);
  }

  ngOnDestroy(): void {
    this.barcodeScanner.startListening();
  }
}
