import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGuestsDetails } from '../../../../../shared/types/IGuestsDetails';

@Component({
  selector: 'app-guests-details',
  templateUrl: './guests-details.component.html',
  styleUrls: ['./guests-details.component.scss'],
})
export class GuestsDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GuestsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGuestsDetails
  ) {}

  ngOnInit(): void {}

  onDecline(): void {
    this.dialogRef.close();
  }

  onApprove(): void {
    this.dialogRef.close(this.data.value);
  }

  increaseValue() {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    if (this.data.value < 8) {
      this.data.value = this.data.value + 1;
    }
  }

  decreaseValue() {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    if (this.data.value > 1) {
      this.data.value = this.data.value - 1;
    }
  }
}
