import { Action } from '@ngrx/store';
import { ICheck } from '../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../shared/types/ICheckItem';
import { ICreateCheckRequest } from '../../../../shared/types/ICreateCheckRequest';
import { IEntityOrderDetails } from '../../../../shared/types/IEntityOrderDetails';
import { IRemoveCheckAction } from '../../../../shared/types/IRemoveCheckAction';
import { ICheckAndProductRequest } from '../../../../shared/types/ICheckAndProductRequest';
import { IRemoveCheckRequest } from '../../../../shared/types/IRemoveCheckItemRequest';

export enum CheckActionTypes {
  LoadChecks = '[Check] Load Checks',
  LoadSuccessChecks = '[Check] Load Success Checks',
  LoadFailChecks = '[Check] Load Fail Checks',
  //
  SetActiveCheck = '[Check] Set Active Check',
  CanActiveCheck = '[Check] Can Active Check',
  LoadActiveCheck = '[Check] Load Active Check',
  LoadSuccessActiveCheck = '[Check] Load Success Active Check',
  LoadFailActiveCheck = '[Check] Load Fail Active Check',
  //
  AddProduct = '[Check] Add Product',
  AddProductError = '[Check] Add Product Error',
  AddActiveProduct = '[Check] Add Active Product',
  RemoveProduct = '[Check] Remove Product',
  RemoveProductError = '[Check] Remove Product Error',
  UpdateProduct = '[Check] Update Product',
  UpdateProductError = '[Check] Update Product Error',
  //
  AddNewCheck = '[Check] Add New Check',
  AddCheckAndProduct = '[Check] Add New Check And Product',
  AddNewCheckError = '[Check] Add New Check Error',
  RemoveCheck = '[Check] Remove Check',
  RemoveCheckError = '[Check] Remove Check Error',
  ClearCheck = '[Check] clear Check',
  ClearCheckError = '[Check] clear Check Error',
  //
  AddLegalEntityData = '[Check] Add Legal Entity Data',
  RemoveLegalEntityData = '[Check] Remove Legal Entity Data',
  LegalEntityDataChangeError = '[Check] Add/Remove Legal Entity Data Error',
  //
  ChangeGuestNumber = '[Check] Change Guest Number',
  ChangeGuestNumberSuccess = '[Check] Change Guest Number Success',
  ChangeGuestNumberFail = '[Check] Change Guest Number Fail',
  //
  ChangeCheckTable = '[Check] Change Check Table',
  ChangeCheckTableSuccess = '[Check] Change Check Table Success',
  ChangeCheckTableFail = '[Check] Change Check Table Fail',
  //
  ChangeTaxRate = '[Check] Change Tax Rate',
  ChangeTaxRateSuccess = '[Check] Change Tax Rate Success',
  ChangeTaxRateFail = '[Check] Change Tax Rate Fail',
  //
  InitializeCheckState = '[Check] Initialize',
}

export class LoadChecks implements Action {
  readonly type = CheckActionTypes.LoadChecks;

  constructor(public payload: number) {}
}
export class LoadSuccessChecks implements Action {
  readonly type = CheckActionTypes.LoadSuccessChecks;

  constructor(public payload: ICheck[]) {}
}
export class LoadFailChecks implements Action {
  readonly type = CheckActionTypes.LoadFailChecks;

  constructor(public payload: string) {}
}
//
export class SetActiveCheck implements Action {
  readonly type = CheckActionTypes.SetActiveCheck;

  constructor(public payload: number) {}
}
export class CanActiveCheck implements Action {
  readonly type = CheckActionTypes.CanActiveCheck;

  constructor(public payload: boolean) {}
}
export class LoadActiveCheck implements Action {
  readonly type = CheckActionTypes.LoadActiveCheck;

  constructor(public payload: number) {}
}
export class LoadSuccessActiveCheck implements Action {
  readonly type = CheckActionTypes.LoadSuccessActiveCheck;

  constructor(public payload: ICheck) {}
}
export class LoadFailActiveCheck implements Action {
  readonly type = CheckActionTypes.LoadFailActiveCheck;

  constructor(public payload: string) {}
}
//
export class AddProduct implements Action {
  readonly type = CheckActionTypes.AddProduct;
  constructor(public payload: ICheckItem) {}
}
export class AddActiveProduct implements Action {
  readonly type = CheckActionTypes.AddActiveProduct;

  constructor(public payload: ICheckItem) {}
}
export class AddProductError implements Action {
  readonly type = CheckActionTypes.AddProductError;

  constructor(public payload: string) {}
}
//
export class UpdateProduct implements Action {
  readonly type = CheckActionTypes.UpdateProduct;

  constructor(public payload: ICheckItem) {}
}
export class UpdateProductError implements Action {
  readonly type = CheckActionTypes.UpdateProductError;

  constructor(public payload: string) {}
}
//
export class RemoveProduct implements Action {
  readonly type = CheckActionTypes.RemoveProduct;

  constructor(public payload: IRemoveCheckRequest) {}
}
export class RemoveProductError implements Action {
  readonly type = CheckActionTypes.RemoveProductError;

  constructor(public payload: string) {}
}
//
export class AddCheckAndProduct implements Action {
  readonly type = CheckActionTypes.AddCheckAndProduct;

  constructor(public payload: ICheckAndProductRequest) {}
}
export class AddNewCheck implements Action {
  readonly type = CheckActionTypes.AddNewCheck;

  constructor(public payload: ICreateCheckRequest) {}
}
export class AddNewCheckError implements Action {
  readonly type = CheckActionTypes.AddNewCheckError;

  constructor(public payload: string) {}
}
//
export class RemoveCheck implements Action {
  readonly type = CheckActionTypes.RemoveCheck;

  constructor(public payload: IRemoveCheckAction) {}
}
export class RemoveCheckError implements Action {
  readonly type = CheckActionTypes.RemoveCheckError;

  constructor(public payload: string) {}
}
//
export class ClearCheck implements Action {
  readonly type = CheckActionTypes.ClearCheck;

  constructor(public payload: number) {}
}
export class ClearCheckError implements Action {
  readonly type = CheckActionTypes.ClearCheckError;

  constructor(public payload: string) {}
}
//
export class AddLegalEntityData implements Action {
  readonly type = CheckActionTypes.AddLegalEntityData;
  constructor(public payload: IEntityOrderDetails) {}
}
export class RemoveLegalEntityData implements Action {
  readonly type = CheckActionTypes.RemoveLegalEntityData;
  constructor(public payload: IEntityOrderDetails) {}
}
export class LegalEntityDataChangeError implements Action {
  readonly type = CheckActionTypes.LegalEntityDataChangeError;
  constructor(public payload: string) {}
}
//
export class ChangeGuestNumber implements Action {
  readonly type = CheckActionTypes.ChangeGuestNumber;
  constructor(public payload: number) {}
}
export class ChangeGuestNumberSuccess implements Action {
  readonly type = CheckActionTypes.ChangeGuestNumberSuccess;
  constructor(public payload: ICheck) {}
}
export class ChangeGuestNumberFail implements Action {
  readonly type = CheckActionTypes.ChangeGuestNumberFail;
  constructor(public payload: string) {}
}

export class ChangeCheckTable implements Action {
  readonly type = CheckActionTypes.ChangeCheckTable;
  constructor(public payload: number) {}
}
export class ChangeCheckTableSuccess implements Action {
  readonly type = CheckActionTypes.ChangeCheckTableSuccess;
  constructor(public payload: ICheck) {}
}
export class ChangeCheckTableFail implements Action {
  readonly type = CheckActionTypes.ChangeCheckTableFail;
  constructor(public payload: string) {}
}

export class ChangeTaxRate implements Action {
  readonly type = CheckActionTypes.ChangeTaxRate;
  constructor(public payload: number) {}
}
export class ChangeTaxRateSuccess implements Action {
  readonly type = CheckActionTypes.ChangeTaxRateSuccess;
  constructor(public payload: ICheck) {}
}
export class ChangeTaxRateFail implements Action {
  readonly type = CheckActionTypes.ChangeTaxRateFail;
  constructor(public payload: string) {}
}

export class InitializeCheckState implements Action {
  readonly type = CheckActionTypes.InitializeCheckState;
  constructor(public payload: string) {}
}
export type CheckActions =
  | LoadChecks
  | LoadSuccessChecks
  | LoadFailChecks
  //
  | SetActiveCheck
  | CanActiveCheck
  | LoadActiveCheck
  | LoadSuccessActiveCheck
  | LoadFailActiveCheck
  //
  | AddActiveProduct
  | AddProduct
  | AddProductError
  | RemoveProduct
  | RemoveProductError
  | UpdateProduct
  | UpdateProductError
  //
  | AddCheckAndProduct
  | AddNewCheck
  | AddNewCheckError
  | RemoveCheck
  | RemoveCheckError
  | ClearCheck
  | ClearCheckError
  //
  | AddLegalEntityData
  | RemoveLegalEntityData
  | LegalEntityDataChangeError
  //
  | ChangeGuestNumber
  | ChangeGuestNumberSuccess
  | ChangeGuestNumberFail
  | ChangeCheckTable
  | ChangeCheckTableSuccess
  | ChangeCheckTableFail
  | ChangeTaxRate
  | ChangeTaxRateSuccess
  | ChangeTaxRateFail
  //
  | InitializeCheckState;
