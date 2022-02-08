import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-payment-numpad',
  templateUrl: './payment-numpad.component.html',
  styleUrls: ['./payment-numpad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentNumpadComponent {
  @Input()
  amountControl: FormControl;

  @Input()
  disabled: boolean;

  @Output()
  exactAmount = new EventEmitter<void>();

  onAdd(value: number): void {
    this.amountControl.setValue((+this.amountControl.value + value).toString());
  }

  onClear(): void {
    this.amountControl.setValue('');
  }
}
