import {
  Component,
  ViewEncapsulation,
  Inject,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  products: Array<any>;
  IMEICodes?: Array<any>;
  listProducts?: Array<any>;
  isIMEI: boolean;
}

@Component({
  selector: 'app-assortiments-dialog',
  templateUrl: './assortiments-dialog.component.html',
  styleUrls: ['./assortiments-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssortimentsDialogComponent {
  itemsQuantity = 0;
  productsAlreadyExistInBasket: boolean;

  constructor(
    private dialogRef: MatDialogRef<AssortimentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sanitizer: DomSanitizer
  ) {}

  checkIfIMEI(product) {
    // console.log('44444444444', this.data.listProducts, product);
    if (!this.data.listProducts.length) {
      return false;
    }
    for (let i = 0; i <= this.data.listProducts.length; i++) {
      if (
        this.data.listProducts[i] &&
        product.imei &&
        product.imei === this.data.listProducts[i].stockItemIMEI
      ) {
        return true;
      }
    }
    return false;
  }

  onSelect(value) {
    if (this.data.isIMEI) {
      const result = this.data.products[0];
      result.stockItemIMEI = value.imei;
      result.imei = value.imei;
      this.dialogRef.close(result);
    } else {
      console.log(value);
      value.stockItemIMEI = undefined;
      value.imei = undefined;
      this.dialogRef.close(value);
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
