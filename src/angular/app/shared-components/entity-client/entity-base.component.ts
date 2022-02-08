import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { TransportationType } from '../../../../shared/types/ETransportationType';
import { ICheckItem } from '../../../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../../../shared/types/IEntityOrderDetails';
import { ITableWithStatus } from '../../../../shared/types/ITableWithStatus';
import { MainProcessService } from '../../core/services/main-process/main-process.service';
import * as fromState from '../../state';
import * as checkActions from '../../state/check/check.actions';

export class entityBaseComponent {
  codeMask = '9{11}';
  driverPINMask = '00000000000';

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

  public unsubscribe$ = new Subject<void>();
  public _subscriptions: Subscription[] = [];
  public _entityOrderDetails: IEntityOrderDetails = null;

  totalPrice: number;
  products: ICheckItem[];
  form: FormGroup;
  citizen: string;
  selectedTable: ITableWithStatus;
  companyType = 'shps';
  paymentType = 'consignation';
  transportation = false;
  locationAddress: string;

  constructor(
    private fb$: FormBuilder,
    private router$: Router,
    private mainProcess$: MainProcessService,
    private _store$: Store<fromState.AppState>,
    private cdr$: ChangeDetectorRef,
    private _location: Location
  ) {}

  getSelectedTable() {
    const sub$ = this._store$
      .pipe(select(fromState.getSelectedTable))
      .subscribe((table: ITableWithStatus) => {
        this.selectedTable = table;
      });
    this._subscriptions.push(sub$);
  }

  checkCitizen(event: any): boolean {
    return event.value === 'georgia' ? false : true;
  }

  onTransportationToggle(): void {
    const controlNames = [
      'driverPIN',
      'driverName',
      'driverCarNumber',
      'driverIsForeignСitizen',
      'endAddress',
    ];

    if (!this.transportation) {
      controlNames.forEach((controlName) => {
        this.form.controls[controlName].setValidators([Validators.required]);
        this.form.controls[controlName].updateValueAndValidity();
      });
    } else {
      controlNames.forEach((controlName) => {
        this.form.controls[controlName].clearValidators();
        this.form.controls[controlName].setValue(null);
        this.form.controls[controlName].updateValueAndValidity();
      });
    }
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
    this._location.back();
  }

  onCitizenshipChange(event: any) {
    this.citizen = event.value;
    this.setValue('driverPIN', null);

    this.driverPINMask = this.citizen === 'foreign' ? '0*' : '00000000000';
  }

  protected getValue(controlName) {
    return this.form.controls[controlName].value;
  }

  protected setValue(controlName, value) {
    this.form.controls[controlName].setValue(value);
  }
}
