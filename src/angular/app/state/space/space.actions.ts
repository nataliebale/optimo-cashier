import { Action } from '@ngrx/store';
import { ISpaceWithActiveChecks } from '../../../../shared/types/ISpaceWithActiveChecks';
import { ITableWithStatus } from '../../../../shared/types/ITableWithStatus';

export enum SpaceActionTypes {
  LoadSpaces = '[Space] Load Spaces',
  LoadSuccessSpaces = '[Space] Load Success Spaces',
  LoadFailSpaces = '[Space] Load Fail Spaces',
  SelectSpace = '[Space] Select Space',
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  LoadSuccessTables = '[Table] Load Success Tables',
  LoadFailTables = '[Table] Load Fail Tables',
  SelectTable = '[Table] Select Table',
}

export class LoadSpaces implements Action {
  readonly type = SpaceActionTypes.LoadSpaces;

  constructor(public payload: number) {}
}
export class LoadSuccessSpaces implements Action {
  readonly type = SpaceActionTypes.LoadSuccessSpaces;

  constructor(public payload: ISpaceWithActiveChecks[]) {}
}
export class LoadFailSpaces implements Action {
  readonly type = SpaceActionTypes.LoadFailSpaces;

  constructor(public payload: string) {}
}
export class SelectSpace implements Action {
  readonly type = SpaceActionTypes.SelectSpace;

  constructor(public payload: ISpaceWithActiveChecks) {}
}
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
export class LoadSuccessTables implements Action {
  readonly type = SpaceActionTypes.LoadSuccessTables;

  constructor(public payload: ITableWithStatus[]) {}
}
export class LoadFailTables implements Action {
  readonly type = SpaceActionTypes.LoadFailTables;

  constructor(public payload: string) {}
}
export class SelectTable implements Action {
  readonly type = SpaceActionTypes.SelectTable;

  constructor(public payload: ITableWithStatus) {}
}

export type SpaceActions =
  | LoadSpaces
  | LoadSuccessSpaces
  | LoadFailSpaces
  | SelectSpace
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  | LoadSuccessTables
  | LoadFailTables
  | SelectTable;
