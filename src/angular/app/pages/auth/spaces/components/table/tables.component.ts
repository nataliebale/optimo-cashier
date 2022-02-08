import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ETableStatus } from '../../../../../../../shared/types/ETableStatus';
import { IOperator } from '../../../../../../../shared/types/IOperator';
import { EBoxType, ITable } from '../../../../../../../shared/types/ITable';
import { ITableWithShowGuest } from '../../../../../../../shared/types/ITableWithShowGuest';
import { ITableWithStatus } from '../../../../../../../shared/types/ITableWithStatus';
import { MessagePopupComponent } from '../../../../../shared-components/popups/message-popup/message-popup.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesComponent implements OnInit {
  @Input() tables: ITableWithShowGuest[];
  @Input() operatorData: IOperator;
  @Input() disabled: boolean;
  @Output() tableSelect = new EventEmitter<ITableWithStatus>();
  public EBoxType = EBoxType;
  public ETableStatus = ETableStatus;
  public estimatedNumberOfGuests = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor(private _cd: ChangeDetectorRef, private _dialog: MatDialog) {}

  ngOnInit(): void {}

  getGuestWrapperPosition(el: HTMLElement) {
    const dOMRect: DOMRect = el.getBoundingClientRect();

    return window.innerHeight - dOMRect.top - dOMRect.height < 280;
  }

  getXOffsetClass(table: ITable): string {
    const screenWidth = window.screen.width;
    const { left, width } = table.arrangement;
    const right = screenWidth - left - width;
    if (width < 90) {
      if (left / 2 + width < 90) {
        return 'left-zero';
      }
      if (right / 2 + width < 90) {
        return 'right-zero';
      }
    }
    return '';
  }

  tableSelectHandler(table: ITableWithShowGuest) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    if (table.tableStatus === ETableStatus.busy) {
      if (
        table.operatorId.toString() !== this.operatorData.id.toString() &&
        !this.operatorData.permissions.canSeeAllOrders
      ) {
        this._dialog.open(MessagePopupComponent, {
          width: '500px',
          data: {
            message: 'თქვენ არ გაქვთ მაგიდაზე შესვლის უფლება.',
            success: false,
          },
        });
        return;
      }
      this.tableSelect.emit(table);
    } else {
      this.showShowEstimatedNumberOfGuests(table);
    }
  }

  showShowEstimatedNumberOfGuests(table: ITableWithShowGuest) {
    table.showGuest = true;
    this._cd.markForCheck();
  }

  hideShowEstimatedNumberOfGuests(table: ITableWithShowGuest) {
    table.showGuest = false;
    this._cd.markForCheck();
  }

  selectEstimatedNumberOfGuests(number: number, table: ITableWithShowGuest) {
    this.hideShowEstimatedNumberOfGuests(table);
    this.tableSelect.emit({
      ...table,
      numberOfGuests: number,
    });
  }
}
