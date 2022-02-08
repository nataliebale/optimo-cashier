import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { EPadAction } from '../../../../../../shared/types/EPadAction';
import { IDashboardNumpadProps } from '../../../../../../shared/types/IDashboardNumpadProps';
import { IOperator } from '../../../../../../shared/types/IOperator';
import { Event, EventBusService } from '../../../../core/services/event-bus.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';

@Component({
  selector: 'app-dashboard-numpad',
  templateUrl: './dashboard-numpad.component.html',
  styleUrls: ['./dashboard-numpad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNumpadComponent implements OnInit, OnDestroy {
  @Input() dashboardNumpadProps: IDashboardNumpadProps;
  @Input() collapse: boolean;
  @Input() disabledPayButton: boolean;
  @Input() isHorecaMode: boolean;
  @Input() maxFractionDigits: number;
  private _operatorData: IOperator;
  @Input()
  set operatorData(value: IOperator) {
    this._operatorData = value;
    const neActions = [...this.actions];
    neActions[1].disabled = !value.permissions.canSetDiscount;
    neActions[2].disabled = !value.permissions.canChangePrice;
    this.actions = neActions;
  }

  get operatorData(): IOperator {
    return this._operatorData;
  }
  @Output() submited = new EventEmitter<void>();
  @Output() activeActionChange = new EventEmitter<EPadAction>();

  actions = [
    {
      label: 'რაოდენობა',
      key: EPadAction.Quantity,
      disabled: false,
    },
    {
      label: 'ფასდაკლება',
      key: EPadAction.DiscountPercentage,
      disabled: false,
    },
    {
      label: 'ფასი',
      key: EPadAction.UnitPrice,
      disabled: false,
    },
    {
      label: 'მომხმარებელი',
      key: EPadAction.Customer,
      disabled: true,
    },
  ];
  isEntitySale: boolean;

  keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0, '.'],
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private storage: LocalStorageService,
    private eventBus: EventBusService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listenEntitySwitcher();
  }

  private listenEntitySwitcher(): void {
    this.eventBus
      .on(Event.SWITCH_ENTITY)
      .pipe(startWith(this.storage.get('entitySwitcher')), takeUntil(this.unsubscribe$))
      .subscribe((entitySwitcher: string) => {
        //todo
        this.isEntitySale = entitySwitcher === 'ი/პ გაყიდვები';
        this.cdr.markForCheck();
      });
  }

  onBackspace(): void {
    const oldValue = this.dashboardNumpadProps.control.value;
    if (oldValue?.length) {
      this.dashboardNumpadProps.control.setValue(oldValue.substring(0, oldValue.length - 1));
    }
  }

  onClear(): void {
    this.dashboardNumpadProps.control.setValue('');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
