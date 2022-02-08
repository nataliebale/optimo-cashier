import { MainProcessService } from './../../../core/services/main-process/main-process.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromState from '../../../state';
import * as checkActions from '../../../state/check/check.actions';
import { Subject, Subscription } from 'rxjs';
import { ICheck } from '../../../../../shared/types/ICheck';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { IEntityOrderDetails } from '../../../../../shared/types/IEntityOrderDetails';
import { IResult } from '../../../../../shared/types/IResult';
import { IEntityClient } from '../../../../../shared/types/IEntityClient';
import { entityBaseComponent } from '../../../shared-components/entity-client/entity-base.component';
import { ISettings } from '../../../../../shared/types/ISettings';
import { Location } from '@angular/common';
import { TransportationType } from '../../../../../shared/types/ETransportationType';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';

export enum LegalEntitySelectMode {
  Search,
  Manual,
}

/*
  90% of thois file is copied from older implementation contains unused code
  TODO: Refactor.
*/
@Component({
  selector: 'app-legal-entity',
  templateUrl: './legal-entity.component.html',
  styleUrls: ['./legal-entity.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalEntityComponent implements OnInit, OnDestroy {
  totalPrice: number;
  products: ICheckItem[];
  form: FormGroup;
  citizen: string;
  selectedTable: ITableWithStatus;
  companyType = 'shps';
  paymentType = 'consignation';
  transportation = false;
  locationAddress: string;

  public _entityOrderDetails: IEntityOrderDetails = null;
  public _subscriptions: Subscription[] = [];
  public unsubscribe$ = new Subject<void>();

  codeMask = '9{11}';
  _driverPINMask = '00000000000';

  get driverPINMask(): string {
    return this._driverPINMask;
  }

  paymentTypeItems = [
    { value: 'byCash', text: 'ნაღდი ანგარიშსწორება' },
    { value: 'consignation', text: 'კონსიგნაცია' },
    { value: 'byCard', text: 'ბარათით ანგარიშსწორება' },
  ];

  citizenItems = [
    { value: 'georgia', text: 'საქართველო' },
    { value: 'foreign', text: 'სხვა' },
  ];

  transportationTypes = [
    { value: TransportationType.Car, label: 'საავტომობილო გადაზიდვა' },
    { value: TransportationType.Other, label: 'სხვა' },
  ];

  selectedClientId: number;
  taxAmount: number;
  taxRate: number;
  checkTaxRateIsOff: boolean;
  totalCost: number;
  // companyTypeItems = [
  //   { value: 'shps', text: 'შ.პ.ს.' },
  //   { value: 'individual', text: 'ინდ. მეწარმე' },
  //   { value: 'stockorg', text: 'ს.ს.' },
  // ];

  LegalEntitySelectMode = LegalEntitySelectMode;
  entitySelectMode = LegalEntitySelectMode.Search;

  TransportationType = TransportationType;

  public clients$: Subject<any> = new Subject();
  public items = [];

  protected onItemsSearch: Subject<any> = new Subject();
  protected onItemsScroll: Subject<any> = new Subject();

  @ViewChild('searchInput', { static: false })
  searchInputref: ElementRef<any>;

  @ViewChild('clientListRef', { static: false })
  clientListRef: ElementRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mainProcess: MainProcessService,
    private _store: Store<fromState.AppState>,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private _store$: Store<fromState.AppState>
  ) {}

  private pageIndex = 0;
  private pageSize = 10;
  private searchKey = '';
  private totalCount: number;

  ngOnInit() {
    this.initializeDataFromState();
    // this.getEntityClients();

    /**
     * this piece of code does listening to keyup and acts to search result.
     * first of all it uses startWith function in order to load data when user enters to the page.
     * debounceTime is used to prevent frequent API calls
     * distinctUntilChanged is used to prevent resend call when inpur value is not changed
     * in map I return target value or param itself.
     * tap is used to do some side effects
     * flatMap is used to merge observable into the stream
     */
    this.onItemsSearch
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        map((param) => (param.target ? param.target.value : param)),
        tap((searchKey: string) => {
          this.pageIndex = 0;
          this.pageSize = 15;
          this.searchKey = searchKey;

          this.clientListRef.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }),
        flatMap(() =>
          this.mainProcess.getEntityClients(this.searchKey, this.pageIndex, this.pageSize)
        )
      )
      .subscribe((result) => {
        this.totalCount = result.count;
        this.items = result.data;
        this.cdr.markForCheck();
      });

    /**
     * With search listener, we need to listen scrool event too,
     * here i do some calculation and liftering this calculations in order to detect when scrool is at the end of the element
     */
    this.onItemsScroll
      .pipe(
        filter(
          (event: any) =>
            this.items.length < this.totalCount &&
            event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight
        ),
        tap(() => {
          this.pageIndex++;
        }),
        flatMap(() =>
          this.mainProcess.getEntityClients(this.searchKey, this.pageIndex, this.pageSize)
        )
      )
      .subscribe((result) => {
        this.items = this.items.concat(result.data);
        this.cdr.markForCheck();
      });
  }

  loadTaxRate() {
    this.mainProcess
      .getSettings()
      .toPromise()
      .then((response: IResult<ISettings>) => {
        const globalTaxRate = response?.data?.taxRate || 0;
        this.checkTaxRateIsOff = globalTaxRate !== 0 && this.taxRate !== globalTaxRate;
      });
  }

  clearSearchInputValue(): void {
    this.searchInputref.nativeElement.value = '';
    this.onItemsSearch.next('');
  }

  // getEntityClient() {
  //   this.clients$ = this.mainProcess.getEntityClients('', 1, 10).pipe(
  //     map((data) => {
  //       return data.data;
  //     })
  //   );
  // }

  getActiveCheck() {
    const sub$ = this._store
      .pipe(
        select(fromState.getActiveCheck),
        filter((r) => !!r)
      )
      .subscribe((activeCheckResult: ICheck) => {
        this.products = activeCheckResult.products;
        this.totalPrice = activeCheckResult.totalPrice;
        this.taxAmount = activeCheckResult.taxAmount;
        this.taxRate = activeCheckResult.taxRate;
        this.totalCost = activeCheckResult.basketTotalPrice;
        this._entityOrderDetails = activeCheckResult.legalEntityData;
        this.loadTaxRate();
        this.createForm(activeCheckResult.legalEntityData);
      });
    this._subscriptions.push(sub$);
  }

  private initializeDataFromState() {
    this.getActiveCheck();
    this.getSelectedTable();
  }

  private createForm(data?: any): void {
    this.getLocationAddress(data);
    this.mainProcess
      .getSettings()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: any) => {
        this.locationAddress = result.data.locationData.address;
      });

    this.paymentType = data?.paymentType || 'consignation';
    this.selectedClientId = data?.id;
    this.transportation = data?.hasTransportation || false;
    this.companyType = data?.entityType;
    this.citizen = data?.driverIsForeignСitizen ? 'foreign' : 'georgia';

    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      code: [data?.code || '', Validators.required],
      // companyType: [this.companyType],
      paymentType: [this.paymentType, Validators.required],
      startAddress: [data?.startAddress || this.locationAddress || '', Validators.required],
      endAddress: [data?.endAddress || '', Validators.required],
      comment: [data?.comment || ''],
      hasTransportation: [this.transportation, Validators.required],
      driverPIN: [data?.driverPIN || '', Validators.required],
      driverName: [data?.driverName || '', Validators.required],
      driverCarNumber: [data?.driverCarNumber || '', Validators.required],
      driverIsForeignСitizen: [this.citizen, Validators.required],
      transportationType: [TransportationType.Car, Validators.required],
      otherTransportName: [data?.otherTransportName || '', Validators.required],
    });

    this.onTransportationToggle(this.form.controls.hasTransportation.value);

    this.form.controls.hasTransportation.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((hasTransportation) => {
        console.log('dev => hasTransportation =>', hasTransportation);
        this.onTransportationToggle(hasTransportation);
        this.cdr.markForCheck();
      });

    this.form.controls.transportationType.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((transportationTypeValue) => {
        console.log('dev => transportationType =>', transportationTypeValue);
        this.transformFormTransportationType(transportationTypeValue);
      });

    this.form.statusChanges.subscribe((to) =>
      console.log('dev => to', to, this.form, this.form.controls.endAddress.disabled)
    );
  }

  transformFormTransportationType(transportationType: TransportationType): void {
    const carControls = [
      'driverPIN',
      'driverName',
      'driverCarNumber',
      'driverIsForeignСitizen',
      'endAddress',
    ];
    const otherControls = ['otherTransportName', 'endAddress'];

    if (transportationType === TransportationType.Car) {
      this.disableControls(this.form, otherControls);
      this.enableControls(this.form, carControls);
    } else if (transportationType === TransportationType.Other) {
      this.disableControls(this.form, carControls);
      this.enableControls(this.form, otherControls);
    } else {
      console.error('invalid value selected at transportationType:', transportationType);
    }
  }

  disableControls(form: FormGroup, controlNames: string[]): void {
    console.log('dev => disableControls:', controlNames);
    controlNames.forEach((controlName) => {
      form.controls[controlName]?.disable();
    });
  }

  enableControls(form: FormGroup, controlNames: string[]): void {
    console.log('dev => enableControls:', controlNames);
    controlNames.forEach((controlName) => {
      form.controls[controlName]?.enable();
    });
  }

  onClientSelect(client: IEntityClient): void {
    this.setValue('name', client.entityName);
    this.setValue('code', client.entityIdentifier);
    // this.setValue('companyType', client.entityType);
    this.selectedClientId = client.id;
    this.companyType = client.entityType;
    console.log(this.form.value);
  }

  onSubmit(): void {
    let data = {
      ...this.form.getRawValue(),
      driverIsForeignСitizen: this.getValue('driverIsForeignСitizen') !== 'georgia',
    };

    console.log('dev => LegalEntity details => submit =>', data);

    if (!data.hasTransportation) {
      data = {
        ...data,
        endAddress: null,
        driverPIN: null,
        driverName: null,
        driverCarNumber: null,
        driverIsForeignСitizen: null,
        transportationType: null,
        transportName: null,
      };
    }

    if (data.hasTransportation && data.transportationType === TransportationType.Car) {
      data = {
        ...data,
        transportName: null,
      };
    }

    if (data.hasTransportation && data.transportationType !== TransportationType.Car) {
      data = {
        ...data,
        driverPIN: null,
        driverName: null,
        driverCarNumber: null,
        driverIsForeignСitizen: null,
      };
    }

    const entityOrderDetails: IEntityOrderDetails = {
      id: this.selectedClientId,
      entityClientId: this.selectedClientId,
      entityIdentifier: data.code,
      entityName: data.name,
      // entityType: this.companyType,
      startAddress: data.startAddress,
      endAddress: data.endAddress,
      hasTransportation: data.hasTransportation,
      driverPIN: data.driverPIN,
      driverName: data.driverName,
      driverCarNumber: data.driverCarNumber,
      driverIsForeignСitizen: data.driverIsForeignСitizen,
      comment: data.comment,
      paymentType: data.paymentType,
      name: data.name,
      code: data.code,
      transportName: data.otherTransportName,
      transportationType: data.transportationType,
    };

    this._store.dispatch(new checkActions.AddLegalEntityData(entityOrderDetails));
    // this.router.navigate(['/payment']);
  }

  onPaymentTypeClick(event: any) {
    this.paymentType = event.value;
    this.setValue('paymentType', event.value);
  }

  // onCompanyTypeChange(event: any) {
  //   this.setValue('code', '');
  //   this.companyType = event.value;

  //   this.codeMask =
  //     this.companyType === 'shps' || this.companyType === 'stockorg' ? '000000000' : '00000000000';
  // }

  private getLocationAddress(data?: any): void {
    this.mainProcess
      .getSettings()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: any) => {
        this.locationAddress = result.data.locationData.address;
        if (!data) {
          this.form.controls['startAddress'].setValue(this.locationAddress);
          this.form.controls['startAddress'].updateValueAndValidity();
        }
        this.cdr.markForCheck();
      });
  }

  switchToAddClient(): void {
    this.entitySelectMode = LegalEntitySelectMode.Manual;
  }

  get transportationType(): TransportationType {
    return this.form.controls.transportationType.value;
  }

  getSelectedTable() {
    const sub$ = this._store$
      .pipe(select(fromState.getSelectedTable))
      .subscribe((table: ITableWithStatus) => {
        this.selectedTable = table;
      });
    this._subscriptions.push(sub$);
  }

  protected getValue(controlName: string) {
    return this.form.controls[controlName].value;
  }

  protected setValue(controlName: string, value: any) {
    this.form.controls[controlName].setValue(value);
  }

  backToDashboard() {
    if (this._entityOrderDetails) {
      this._store$.dispatch(new checkActions.RemoveLegalEntityData(null));
    }
    let queryParams = {};
    if (this.selectedTable) {
      queryParams = {
        numberOfGuests: this.selectedTable.numberOfGuests,
        tableId: this.selectedTable.id,
      };
    }
    // this.router$.navigate([`/dashboard`], {
    //   queryParams: queryParams,
    // });
    this.location.back();
  }

  get hasTransportation(): boolean {
    return this?.form?.controls?.hasTransportation?.value || false;
  }

  onTransportationToggle(transportation: boolean): void {
    console.log('dev => onTransportationToggle');

    const controlNames = [
      'transportationType',
      'driverPIN',
      'driverName',
      'driverCarNumber',
      'driverIsForeignСitizen',
      'endAddress',
      'otherTransportName',
    ];

    if (transportation) {
      this.form.controls.transportationType.enable();
      this.transformFormTransportationType(this.form.controls.transportationType.value);
    } else {
      controlNames.forEach((controlName) => this.form.controls[controlName].disable());
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
