import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { endOfDay, startOfDay, formatISO } from 'date-fns';
import { PaymentMethods } from '../../../../../../../shared/enums/PaymentMethods';
import { ITransactionHistoryFilter } from '../../../../../../../shared/types/ITransactionHistoryFilter';
import { IPaymentMethodsList } from '../../containers/order-history/order-history.component';

@Component({
  selector: 'app-order-history-filter',
  templateUrl: './order-history-filter.component.html',
  styleUrls: ['./order-history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryFilterComponent implements OnInit {
  @Input() filter: ITransactionHistoryFilter;
  @Input() entity: boolean;
  @Input() paymentMethodsList: IPaymentMethodsList[];
  @Output() changeFilter = new EventEmitter<ITransactionHistoryFilter>();
  @Output() changeOrderType = new EventEmitter<boolean>();
  public showFilter = false;
  public showEntitySwitcher = false;
  public isDatePickerVisible: boolean;
  constructor() {}

  public toggleFilterDropdown(value?: boolean): void {
    this.showFilter = value !== undefined ? value : !this.showFilter;
  }

  public toggleDatePicker(event: Event): void {
    event.stopPropagation();
    this.toggleFilterDropdown(false);
    this.isDatePickerVisible = !this.isDatePickerVisible;
  }

  onDateChanged(dates: Date[]): void {
    if (dates) {
      this.filter = {
        ...this.filter,
        from: formatISO(startOfDay(dates[0])),
        to: formatISO(endOfDay(dates[1])),
      };
      this.changeFilter.emit(this.filter);
    }
  }

  public toggleEntitySwitcher(value: boolean): void {
    this.showEntitySwitcher = value;
  }

  public changeOrderTypeHandler(value: boolean): void {
    if (this.entity !== value) {
      this.entity === value;
      this.changeOrderType.emit(value);
    }
    this.toggleEntitySwitcher(false);
  }

  public selectPaymentMethod(paymentMethods: PaymentMethods): void {
    if (paymentMethods === undefined) {
      const filter = { ...this.filter };
      delete filter.paymentMethod;
      this.filter = { ...filter };
    } else {
      this.filter = {
        ...this.filter,
        paymentMethod: paymentMethods,
      };
    }
    this.changeFilter.emit(this.filter);
    this.toggleFilterDropdown(false);
  }

  ngOnInit(): void {}
}
