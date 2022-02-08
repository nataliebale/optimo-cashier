import { MainProcessService } from './../../../core/services/main-process/main-process.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromState from '../../../state';
import * as checkActions from '../../../state/check/check.actions';
import { Subject, Subscription } from 'rxjs';
import { ICheck } from '../../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { filter, takeUntil } from 'rxjs/operators';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';
import { IEntityOrderDetails } from '../../../../../shared/types/IEntityOrderDetails';
import { entityBaseComponent } from '../../../shared-components/entity-client/entity-base.component';
import { IResult } from '../../../../../shared/types/IResult';
import { ISettings } from '../../../../../shared/types/ISettings';
import { Location } from '@angular/common';
@Component({
  selector: 'app-legal-entity',
  templateUrl: './add-new-client.component.html',
  styleUrls: ['./add-new-client.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewClientComponent extends entityBaseComponent implements OnInit, OnDestroy {
  //   companyTypeItems = [
  //     { value: 'shps', text: 'შ.პ.ს.' },
  //     { value: 'individual', text: 'ინდ. მეწარმე' },
  //     { value: 'stockorg', text: 'ს.ს.' },
  //   ];
  taxAmount: number;
  taxRate: number;
  totalCost: number;
  checkTaxRateIsOff: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mainProcess: MainProcessService,
    private _store: Store<fromState.AppState>,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    super(fb, router, mainProcess, _store, cdr, location);
  }

  ngOnInit() {
    this.initializeDataFromState();
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

    this.companyType = data?.companyType || 'shps';
    this.paymentType = data?.paymentType || 'consignation';
    this.transportation = data?.hasTransportation || false;
    this.citizen = data?.driverIsForeignСitizen ? 'foreign' : 'georgia';

    const transportationValidators = data?.hasTransportation && [Validators.required];

    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      code: [
        data?.code || '',
        [Validators.required, Validators.maxLength(11), Validators.minLength(9)],
      ],
      companyType: [this.companyType, Validators.required],
      paymentType: [this.paymentType, Validators.required],
      startAddress: [data?.startAddress || this.locationAddress || '', Validators.required],
      endAddress: [data?.endAddress || ''],
      comment: [data?.comment || ''],
      hasTransportation: [this.transportation, Validators.required],
      driverPIN: [data?.driverPIN || '', transportationValidators],
      driverName: [data?.driverName || '', transportationValidators],
      driverCarNumber: [data?.driverCarNumber || '', transportationValidators],
      driverIsForeignСitizen: [this.citizen, transportationValidators],
    });
  }

  onSubmit(): void {
    let data = {
      ...this.form.getRawValue(),
      driverIsForeignСitizen: this.getValue('driverIsForeignСitizen') !== 'georgia',
    };

    if (!data.hasTransportation) {
      data = {
        ...data,
        endAddress: null,
        driverPIN: null,
        driverName: null,
        driverCarNumber: null,
        driverIsForeignСitizen: null,
      };
    }
    const entityOrderDetails: IEntityOrderDetails = {
      entityIdentifier: data.code,
      entityName: data.name,
      // entityType: data.companyType,
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
    };
    // console.log('dev => entityOrderDetails:', entityOrderDetails);
    this._store.dispatch(new checkActions.AddLegalEntityData(entityOrderDetails));
    // this.router.navigate(['/payment']);
  }

  onPaymentTypeClick(event: any) {
    this.paymentType = event.value;
  }

  //   onCompanyTypeChange(event: any) {
  //     this.setValue('code', '');
  //     this.companyType = event.value;

  //     this.codeMask =
  //       this.companyType === 'shps' || this.companyType === 'stockorg' ? '000000000' : '00000000000';
  //   }

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

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
