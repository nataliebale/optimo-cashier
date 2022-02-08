import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { IResult } from '../../../../shared/types/IResult';
import { ISpaceWithActiveChecks } from '../../../../shared/types/ISpaceWithActiveChecks';
import { ITableWithStatus } from '../../../../shared/types/ITableWithStatus';
import { MainProcessService } from '../../core/services/main-process/main-process.service';
import * as spaceActions from './space.actions';
@Injectable()
export class SpaceEffects {
  constructor(private _actions$: Actions, private _mainProcessService: MainProcessService) {}

  @Effect()
  loadSpaces$: Observable<Action> = this._actions$.pipe(
    ofType(spaceActions.SpaceActionTypes.LoadSpaces),
    mergeMap(() =>
      from(this._mainProcessService.getSpaces()).pipe(
        map((loadSpacesResult: IResult<ISpaceWithActiveChecks[]>) => {
          return loadSpacesResult.data
            ? new spaceActions.LoadSuccessSpaces(loadSpacesResult.data)
            : new spaceActions.LoadFailSpaces(loadSpacesResult.err);
        }),
        catchError((err) => of(new spaceActions.LoadFailSpaces(err)))
      )
    )
  );

  @Effect()
  loadTables$: Observable<Action> = this._actions$.pipe(
    ofType(spaceActions.SpaceActionTypes.SelectSpace),
    map((action: spaceActions.SelectSpace) => action.payload),
    mergeMap((space: ISpaceWithActiveChecks) =>
      from(this._mainProcessService.getTablesWithStatus(space.id)).pipe(
        map((loadTablesResult: IResult<ITableWithStatus[]>) => {
          return loadTablesResult.data
            ? new spaceActions.LoadSuccessTables(loadTablesResult.data)
            : new spaceActions.LoadFailTables(loadTablesResult.err);
        }),
        catchError((err) => of(new spaceActions.LoadFailTables(err)))
      )
    )
  );
}
