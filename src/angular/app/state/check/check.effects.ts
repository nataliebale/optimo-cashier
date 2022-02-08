import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';

/* NgRx */
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as checkActions from './check.actions';
import { MainProcessService } from '../../core/services/main-process/main-process.service';
import { IResult } from '../../../../shared/types/IResult';
import { ICheck } from '../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../../../shared/types/IEntityOrderDetails';
import { IRemoveCheckAction } from '../../../../shared/types/IRemoveCheckAction';
import { ICheckAndProductResult } from '../../../../shared/types/ICheckAndProductResult';
import { IAddProductResult } from '../../../../shared/types/IAddProductResult';
import { Router } from '@angular/router';

@Injectable()
export class CecksEffects {
  constructor(
    private _actions$: Actions,
    private _mainProcessService: MainProcessService,
    private router: Router
  ) {}

  // @Effect()
  // loadChecks$: Observable<Action> = this._actions$.pipe(
  //   ofType(checkActions.CheckActionTypes.LoadChecks),
  //   map((action: checkActions.LoadChecks) => action.payload),
  //   mergeMap((payload: number) =>
  //     this._mainProcessService.checks(payload).pipe(
  //       map((loadChecksResult: IResult<ICheck[]>) => {
  //         return loadChecksResult.data
  //           ? new checkActions.LoadSuccessChecks(loadChecksResult.data)
  //           : new checkActions.LoadFailChecks(loadChecksResult.err);
  //       }),
  //       catchError((err) => {
  //         return of(new checkActions.LoadFailChecks(err));
  //       })
  //     )
  //   )
  // );
  @Effect()
  loadChecks$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.LoadChecks),
    switchMap((action: checkActions.LoadChecks) => this._mainProcessService.checks(action.payload)),
    switchMap((loadChecksResult: IResult<ICheck[]>) => {
      if (loadChecksResult.data) {
        return [
          new checkActions.CanActiveCheck(true),
          new checkActions.LoadSuccessChecks(loadChecksResult.data),
        ];
      } else {
        return of(new checkActions.LoadFailChecks(loadChecksResult.err));
      }
    }),
    catchError((err) => {
      return of(new checkActions.LoadFailChecks(err));
    })
  );

  @Effect()
  setActiveCheck$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.SetActiveCheck),
    map((action: checkActions.SetActiveCheck) => action.payload),
    mergeMap((payload: number) =>
      this._mainProcessService.checkSetActive(payload).pipe(
        map((setactiveCheckResult: IResult<ICheck>) => {
          return setactiveCheckResult.data
            ? new checkActions.LoadSuccessActiveCheck(setactiveCheckResult.data)
            : new checkActions.LoadFailActiveCheck(setactiveCheckResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.LoadFailActiveCheck(err));
        })
      )
    )
  );

  @Effect()
  addProduct$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.AddProduct),
    switchMap((action: checkActions.AddProduct) =>
      this._mainProcessService.checkAddItem(action.payload).pipe(
        map((addProductResult: IResult<ICheck>) => {
          const result: IAddProductResult = {
            addProductResult: addProductResult,
            product: action.payload,
          };
          return result;
        })
      )
    ),
    switchMap((result: IAddProductResult) => {
      if (result.addProductResult.data) {
        return [
          new checkActions.LoadSuccessActiveCheck(result.addProductResult.data),
          new checkActions.AddActiveProduct(result.product),
        ];
      } else {
        return of(new checkActions.AddProductError(result.addProductResult.err));
      }
    }),
    catchError((err) => {
      return of(new checkActions.AddProductError(err));
    })
  );

  @Effect()
  updateProduct$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.UpdateProduct),
    map((action: checkActions.UpdateProduct) => action.payload),
    mergeMap((payload: ICheckItem) =>
      this._mainProcessService.checkUpdateItem(payload).pipe(
        map((updateProductResult: IResult<ICheck>) => {
          console.log('Checkeffects -> updateProduct -> product: ', payload);
          return updateProductResult.data
            ? new checkActions.LoadSuccessActiveCheck(updateProductResult.data)
            : new checkActions.UpdateProductError(updateProductResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.UpdateProductError(err));
        })
      )
    )
  );

  @Effect()
  removeProduct$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.RemoveProduct),
    switchMap((action: checkActions.RemoveProduct) =>
      this._mainProcessService.checkRemoveItem(action.payload)
    ),
    switchMap((removeProductResult: IResult<ICheck>) => {
      if (removeProductResult.data) {
        return [
          new checkActions.LoadSuccessActiveCheck(removeProductResult.data),
          new checkActions.AddActiveProduct(null),
        ];
      } else {
        return of(new checkActions.RemoveProductError(removeProductResult.err));
      }
    }),
    catchError((err) => {
      return of(new checkActions.RemoveProductError(err));
    })
  );

  @Effect()
  addNewCheck$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.AddNewCheck),
    switchMap((action: checkActions.AddNewCheck) =>
      this._mainProcessService.checkCreate(action.payload)
    ),
    switchMap((addNewCheckResult: IResult<ICheck>) => {
      if (addNewCheckResult.data) {
        return [
          new checkActions.LoadSuccessActiveCheck(addNewCheckResult.data),
          new checkActions.LoadChecks(addNewCheckResult.data.tableId),
        ];
      } else {
        return of(new checkActions.AddNewCheckError(addNewCheckResult.err));
      }
    }),
    catchError((err) => {
      return of(new checkActions.AddNewCheckError(err));
    })
  );

  @Effect()
  addCheckAndProduct$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.AddCheckAndProduct),
    switchMap((action: checkActions.AddCheckAndProduct) =>
      this._mainProcessService.checkCreate(action.payload.checkRequest).pipe(
        map((addNewCheckResult: IResult<ICheck>) => {
          const result: ICheckAndProductResult = {
            addNewCheckResult: addNewCheckResult,
            product: action.payload.product,
          };
          return result;
        })
      )
    ),
    switchMap((result: ICheckAndProductResult) => {
      if (result.addNewCheckResult.data) {
        return [
          new checkActions.CanActiveCheck(false),
          new checkActions.LoadSuccessChecks([result.addNewCheckResult.data]),
          new checkActions.AddProduct(result.product),
        ];
      } else {
        return of(new checkActions.AddNewCheckError(result.addNewCheckResult.err));
      }
    }),
    catchError((err) => {
      return of(new checkActions.AddNewCheckError(err));
    })
  );

  @Effect()
  removeNewCheck$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.RemoveCheck),
    map((action: checkActions.RemoveCheck) => action.payload),
    mergeMap((payload: IRemoveCheckAction) =>
      this._mainProcessService.checkDeleteCheck(payload.checkId).pipe(
        map(() => {
          if (payload.navigateToSpacesPage) {
            this.router.navigate(['space']);
          }
          if (payload.loadCheckAfterRemove) {
            return new checkActions.LoadChecks(payload.tableId ? payload.tableId : null);
          } else {
            return new checkActions.LoadSuccessChecks([]);
          }
        }),
        catchError((err) => {
          return of(new checkActions.RemoveCheckError(err));
        })
      )
    )
  );

  @Effect()
  clearCheck$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.ClearCheck),
    map((action: checkActions.ClearCheck) => action.payload),
    mergeMap(() =>
      this._mainProcessService.checkRemoveAllItems().pipe(
        map((clearCheckResult: IResult<ICheck>) => {
          return clearCheckResult.data
            ? new checkActions.LoadSuccessActiveCheck(clearCheckResult.data)
            : new checkActions.ClearCheckError(clearCheckResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.ClearCheckError(err));
        })
      )
    )
  );

  @Effect()
  addLegalEntityData$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.AddLegalEntityData),
    map((action: checkActions.AddLegalEntityData) => action.payload),
    mergeMap((payload: IEntityOrderDetails) =>
      this._mainProcessService.checkSetLegalEntityData(payload).pipe(
        map((addLegalEntityDataResult: IResult<ICheck>) => {
          if (addLegalEntityDataResult.data) {
            this.router.navigate(['/payment']);
            return new checkActions.LoadSuccessActiveCheck(addLegalEntityDataResult.data);
          } else {
            return new checkActions.LegalEntityDataChangeError(addLegalEntityDataResult.err);
          }
        }),
        catchError((err) => {
          return of(new checkActions.LegalEntityDataChangeError(err));
        })
      )
    )
  );

  @Effect()
  loadActiveCheck$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.LoadActiveCheck),
    mergeMap(() =>
      this._mainProcessService.checkGetActive().pipe(
        map((loadActiveCheckResult: IResult<ICheck>) => {
          return loadActiveCheckResult.data
            ? new checkActions.LoadSuccessActiveCheck(loadActiveCheckResult.data)
            : new checkActions.LoadFailActiveCheck(loadActiveCheckResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.LoadFailActiveCheck(err));
        })
      )
    )
  );

  @Effect()
  removeLegalEntityData$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.RemoveLegalEntityData),
    map((action: checkActions.RemoveLegalEntityData) => action.payload),
    mergeMap(() =>
      this._mainProcessService.checkUnsetLegalEntityData().pipe(
        map((addLegalEntityDataResult: IResult<ICheck>) => {
          return addLegalEntityDataResult.data
            ? new checkActions.LoadSuccessActiveCheck(addLegalEntityDataResult.data)
            : new checkActions.LegalEntityDataChangeError(addLegalEntityDataResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.LegalEntityDataChangeError(err));
        })
      )
    )
  );

  @Effect()
  changeGuestNumber$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.ChangeGuestNumber),
    map((action: checkActions.ChangeGuestNumber) => action.payload),
    mergeMap((payload: number) =>
      this._mainProcessService.checkUpdateGuesGuestCount(payload).pipe(
        map((changeGuestNumberResult: IResult<ICheck>) => {
          return changeGuestNumberResult.data
            ? new checkActions.ChangeGuestNumberSuccess(changeGuestNumberResult.data)
            : new checkActions.ChangeGuestNumberFail(changeGuestNumberResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.ChangeGuestNumberFail(err));
        })
      )
    )
  );

  @Effect()
  changeCheckTable$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.ChangeCheckTable),
    map((action: checkActions.ChangeCheckTable) => action.payload),
    mergeMap((payload: number) =>
      this._mainProcessService.checkSetTable(payload).pipe(
        map((changeCheckTableResult: IResult<ICheck>) => {
          return changeCheckTableResult.data
            ? new checkActions.ChangeCheckTableSuccess(changeCheckTableResult.data)
            : new checkActions.ChangeCheckTableFail(changeCheckTableResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.ChangeCheckTableFail(err));
        })
      )
    )
  );

  @Effect()
  changeTaxRate$: Observable<Action> = this._actions$.pipe(
    ofType(checkActions.CheckActionTypes.ChangeTaxRate),
    map((action: checkActions.ChangeTaxRate) => action.payload),
    mergeMap((payload: number) =>
      this._mainProcessService.checkSetTaxRate(payload).pipe(
        map((changeTaxRateResult: IResult<ICheck>) => {
          return changeTaxRateResult.data
            ? new checkActions.ChangeTaxRateSuccess(changeTaxRateResult.data)
            : new checkActions.ChangeTaxRateFail(changeTaxRateResult.err);
        }),
        catchError((err) => {
          return of(new checkActions.ChangeTaxRateFail(err));
        })
      )
    )
  );
}
