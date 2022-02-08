import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITransactionHistoryFilter } from '../../../../../../../shared/types/ITransactionHistoryFilter';
import { ITransactionListItem } from '../../../../../../../shared/types/ITransactionList';

@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrls: ['./order-history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryListComponent implements OnInit {
  @Input() transactionList: ITransactionListItem[];
  @Input() selectedTransactionId: number;
  @Input() isHorecaMode: boolean;
  @Input() filter: ITransactionHistoryFilter;
  @Output() selectOrder = new EventEmitter<number>();
  @Output() searchChanged = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  handleSearchChange(value: string): void {
    this.searchChanged.emit(value);
  }
}
