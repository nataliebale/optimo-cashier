import { FormGroup } from '@angular/forms';
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-amount',
  templateUrl: './payment-amount.component.html',
  styleUrls: ['./payment-amount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAmountComponent {
  @Input()
  amountFormGroup: FormGroup;

  @Input()
  totalPrice: any;

  @Output()
  outReturnAmount = new EventEmitter<any>();

  onInputChange(): void {
    this.outReturnAmount.emit(this.amountFormGroup.controls.amount.value - this.totalPrice);
  }

  onExactAmount(): void {
    this.amountFormGroup.controls['amount'].setValue(this.totalPrice);
  }
}
