import { MainProcessSetupService } from '../../../core/services/main-process/main-process.setup.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { Environment } from '../../../../../shared/enums/Environment';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { IBOListModel } from '../../../../../shared/types/IBOListModel';
import { ICredentials } from '../../../../../shared/types/ICredentials';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  takeUntil,
  startWith,
} from 'rxjs/operators';
import { ILegalEntityListModel } from '../../../../../shared/types/ILegalEntityListModel';

@Component({
  selector: 'app-setup-legal-entity',
  templateUrl: './setup-legal-entity.component.html',
  styleUrls: ['./setup-legal-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupLegalEntityComponent implements OnInit, OnDestroy {
  @Input()
  credentials: ICredentials;

  @Output()
  legalEntity = new EventEmitter<ILegalEntityListModel>();

  @Output()
  back = new EventEmitter<void>();

  private _selectedEnv: Environment;

  set selectedEnv(value: Environment) {
    this._selectedEnv = value;
    this.setEnv();
  }

  get selectedEnv(): Environment {
    return this._selectedEnv;
  }

  search$ = new Subject<string>();
  legalEntities$: Observable<ILegalEntityListModel[]>;
  selectedLegalEntity: ILegalEntityListModel;
  legalEntitiesLoading: boolean;

  selectedBO: IBOListModel;

  deviceSerialNumber: string;

  environmentMap = [
    { text: 'Staging', value: Environment.Staging },
    { text: 'Production', value: Environment.Production },
    { text: 'Development', value: Environment.Development },
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private odin: MainProcessService,
    private setup: MainProcessSetupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBusinessOwners();
    this.getCurrentEnv();
  }

  private getCurrentEnv(): void {
    this.odin
      .getEnv()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this._selectedEnv = data;
        this.cdr.markForCheck();
      });
  }

  private loadBusinessOwners(): void {
    this.legalEntities$ = this.search$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.legalEntitiesLoading = true)),
      switchMap((keyword) =>
        this.search(keyword).pipe(
          catchError(() => of([])),
          tap(() => (this.legalEntitiesLoading = false))
        )
      ),
      startWith([])
    );
  }

  private search(keyword: string) {
    return this.setup
      .getBOList({
        userName: this.credentials.userName,
        password: this.credentials.password,
        keyword,
      })
      .pipe(
        map((list) =>
          list.data.map((item) => ({
            ...item,
            caption: `${item.companyName} - ${item.identificationNumber}`,
          }))
        )
      );
  }

  onSubmit(): void {
    console.log(this.selectedBO);
    console.log(this.deviceSerialNumber);
    if (this.deviceSerialNumber) {
      this.odin
        .setDeviceSerialNumber(this.deviceSerialNumber)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          console.log(
            'TCL: SetupComponent -> setDeviceSerialNumber -> deviceSerialNumber',
            this.deviceSerialNumber
          );
          this.legalEntity.emit(this.selectedLegalEntity);
        });
    } else {
      this.legalEntity.emit(this.selectedLegalEntity);
    }
  }

  private setEnv(): void {
    this.odin
      .setEnv(+this.selectedEnv)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          alert('Restarting');
          this.odin.relaunch();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
