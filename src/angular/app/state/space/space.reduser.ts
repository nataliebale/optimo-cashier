import { ISpaceWithActiveChecks } from '../../../../shared/types/ISpaceWithActiveChecks';
import { ITableWithShowGuest } from '../../../../shared/types/ITableWithShowGuest';
import { ITableWithStatus } from '../../../../shared/types/ITableWithStatus';
import { SpaceActions, SpaceActionTypes } from './space.actions';
export interface SpaceState {
  spaces: ISpaceWithActiveChecks[];
  spacesError: string;
  selectedSpace: ISpaceWithActiveChecks;
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  tables: ITableWithStatus[];
  tablesError: string;
  selectedTable: ITableWithStatus;
}

const initialState: SpaceState = {
  spaces: [],
  spacesError: '',
  selectedSpace: null,
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  tables: [],
  tablesError: '',
  selectedTable: null,
};

export function reducer(state = initialState, action: SpaceActions): SpaceState {
  switch (action.type) {
    case SpaceActionTypes.LoadSuccessSpaces:
      return {
        ...state,
        spaces: action.payload,
      };
    case SpaceActionTypes.LoadFailSpaces:
      return {
        ...state,
        spacesError: action.payload,
      };
    case SpaceActionTypes.SelectSpace:
      return {
        ...state,
        selectedSpace: action.payload,
      };
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    case SpaceActionTypes.LoadSuccessTables:
      return {
        ...state,
        tables: action.payload.map((table: ITableWithShowGuest) => ({
          ...table,
          arrangement: {
            height: table.arrangement?.height * (window.screen.width / 960),
            width: table.arrangement?.width * (window.screen.width / 960),
            left: table.arrangement?.left * (window.screen.width / 960),
            top: table.arrangement?.top * (window.screen.width / 960),
            boxType: table.arrangement?.boxType,
          },
        })),
      };
    case SpaceActionTypes.LoadFailTables:
      return {
        ...state,
        tablesError: action.payload,
      };
    case SpaceActionTypes.SelectTable:
      return {
        ...state,
        selectedTable: action.payload,
      };
    default:
      return state;
  }
}
