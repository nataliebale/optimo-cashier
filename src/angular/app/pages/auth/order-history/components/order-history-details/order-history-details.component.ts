import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { EntityPaymentMethods } from '../../../../../../../shared/enums/EntityPaymentMethods';
import { PaymentMethods } from '../../../../../../../shared/enums/PaymentMethods';
import { IOperator } from '../../../../../../../shared/types/IOperator';
import {
  ITransactionDetailAction,
  TransactionActionType,
} from '../../../../../../../shared/types/ITransactionDetailAction';
import { ITransactionDetails } from '../../../../../../../shared/types/ITransactionDetails';
import { LocalStorageService } from '../../../../../services/local-storage.service';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryDetailsComponent implements OnInit {
  @Input() transactionDetails: ITransactionDetails;
  @Input() isHorecaMode: boolean;
  @Input() entity: boolean;
  @Output() action = new EventEmitter<ITransactionDetailAction>();
  public PaymentMethods = PaymentMethods;
  public EntityPaymentMethods = EntityPaymentMethods;
  constructor(private _storage: LocalStorageService) {}

  operatorData: IOperator;

  ngOnInit(): void {
    this.operatorData = this._storage.get('operator-data');
  }

  emitAction(actionType: 'return' | 'print' | 'open-linked' | 'open-cancelled'): void {
    switch (actionType) {
      case 'return':
        this.action.emit({
          transactionId: this.transactionDetails.id,
          action: TransactionActionType.Return,
        });
        // console.log('dev => return action fired on', this.transactionDetails);
        break;
      case 'print':
        this.action.emit({
          transactionId: this.transactionDetails.id,
          action: TransactionActionType.Print,
        });
        // console.log('dev => print action fired on', this.transactionDetails);
        break;
      case 'open-linked':
        this.action.emit({
          transactionId: this.transactionDetails.linkedTransactionId,
          action: TransactionActionType.OpenLinked,
        });
        // console.log('dev => open-linked action fired on', this.transactionDetails);
        break;
      case 'open-cancelled':
        this.action.emit({
          transactionId: this.transactionDetails.cancelledTransactionId,
          action: TransactionActionType.OpenLinked,
        });
        // console.log('dev => open-linked action fired on', this.transactionDetails);
        break;
      default:
        console.error('dev => actionType not provided');
    }
  }

  getUnitOfMeasurement(unitOfMeasurement: number): string {
    switch (unitOfMeasurement) {
      case 1:
        return 'ც';
      case 2:
        return 'კგ';
      case 3:
        return 'ლ';
      case 4:
        return 'მ';
      case 5:
        return 'მ²';
      default:
        return '';
    }
  }

  get hasReturnPermission(): boolean {
    // console.log('dev => operatorData', this.operatorData);
    return this?.operatorData?.permissions?.canReturnOrder || false;
  }
}
