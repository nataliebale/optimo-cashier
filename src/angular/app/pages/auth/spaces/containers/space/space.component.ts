import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription, timer, interval } from 'rxjs';
import { OptimoProductType } from '../../../../../../../shared/enums/OptimoProductType';
import { IOperator } from '../../../../../../../shared/types/IOperator';
import { IResult } from '../../../../../../../shared/types/IResult';
import { IShift } from '../../../../../../../shared/types/IShift';
import { ISpaceWithActiveChecks } from '../../../../../../../shared/types/ISpaceWithActiveChecks';
import { ITableWithShowGuest } from '../../../../../../../shared/types/ITableWithShowGuest';
import { ITableWithStatus } from '../../../../../../../shared/types/ITableWithStatus';
import { Event, EventBusService } from '../../../../../core/services/event-bus.service';
import { MainProcessService } from '../../../../../core/services/main-process/main-process.service';
import { ShiftService } from '../../../../../core/services/shift.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import * as fromState from '../../../../../state';
import * as spaceActions from '../../../../../state/space/space.actions';
@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaceComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  public spaces: ISpaceWithActiveChecks[] = [];
  public tables: ITableWithShowGuest[];
  public selectedSpace: ISpaceWithActiveChecks;
  public openBurgerMenuForShiftStart: boolean;
  public operatorData: IOperator;
  public shift$ = this._shiftService.valueChanges;
  public get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }
  constructor(
    private _store: Store<fromState.AppState>,
    private _router: Router,
    private _cd: ChangeDetectorRef,
    private _shiftService: ShiftService,
    private _storage: LocalStorageService,
    private _mainProcessService: MainProcessService,
    private _dialog: MatDialog,
    private _eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.refreshOnSync();
  }

  refreshOnSync(): void {
    const sub$: Subscription = this._eventBus.on(Event.SYNCED).subscribe(() => {
      this.loadSpaces();
    });
    this._subscriptions.push(sub$);
  }

  checkUserPermission() {
    this.operatorData = this._storage.get('operator-data');
    if (this.operatorData.permissions.canOpenShift) {
      this._mainProcessService
        .getShift()
        .toPromise()
        .then((val: IResult<IShift>) => {
          if (!(val && val.data)) {
            this.openBurgerMenuForShiftStart = true;
            this._cd.markForCheck();
          }
        });
    }
  }

  initialize() {
    this.checkUserPermission();
    this.loadSpaces();
    this.getSelectedSpaces();
    this.getSpaces();
    this.getTables();
    const sub$ = interval(1000 * 1000).subscribe(() => {
      this.loadSpaces();
    });
    this._subscriptions.push(sub$);
  }

  getTables() {
    const sub$: Subscription = this._store
      .pipe(select(fromState.getTables))
      .subscribe((tables: ITableWithStatus[]) => {
        this.tables = tables.map((table) => {
          return {
            ...table,
            showGuest: false,
          };
        });
        this._cd.markForCheck();
      });
    this._subscriptions.push(sub$);
  }

  loadSpaces() {
    this._store.dispatch(new spaceActions.LoadSpaces(null));
  }

  getSpaces() {
    const sub$: Subscription = this._store
      .pipe(select(fromState.getSpaces))
      .subscribe((spaces: ISpaceWithActiveChecks[]) => {
        if (spaces && spaces.length) {
          let selectedSpace = spaces[0];
          if (this.selectedSpace) {
            selectedSpace =
              spaces.find((space) => space.id === this.selectedSpace.id) || selectedSpace;
          }
          this._store.dispatch(new spaceActions.SelectSpace(selectedSpace));
        }
        this.spaces = spaces;
        this._cd.markForCheck();
      });
    this._subscriptions.push(sub$);
  }

  getSelectedSpaces() {
    const sub$: Subscription = this._store
      .pipe(select(fromState.getSelectedSpace))
      .subscribe((selectedSpace: ISpaceWithActiveChecks) => {
        this.selectedSpace = selectedSpace;
        this._cd.markForCheck();
      });
    this._subscriptions.push(sub$);
  }

  selectSpace(space: ISpaceWithActiveChecks) {
    this._store.dispatch(new spaceActions.SelectSpace(space));
  }

  selectTable(table: ITableWithStatus) {
    this._store.dispatch(new spaceActions.SelectTable(table));
    this._router.navigate([`/dashboard`], {
      queryParams: {
        numberOfGuests: table.numberOfGuests,
        tableId: table.id,
        tableName: table.name,
      },
    });
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this._store.dispatch(new spaceActions.LoadSuccessSpaces([]));
  }
}
