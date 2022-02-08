import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCheck from './check/check.reducer';
import * as fromSpace from './space/space.reduser';

export const reducers: ActionReducerMap<AppState> = {
  check: fromCheck.reducer,
  space: fromSpace.reducer,
};

export const getCheckFeatureState = createFeatureSelector<AppState, fromCheck.CheckState>('check');
export const getSpaceFeatureState = createFeatureSelector<AppState, fromSpace.SpaceState>('space');

export interface AppState {
  check: fromCheck.CheckState;
  space: fromSpace.SpaceState;
}

// Selector functions
export const getActiveCheck = createSelector(getCheckFeatureState, (state) => state.activeCheck);

export const getCanActivateCheck = createSelector(
  getCheckFeatureState,
  (state) => state.canActiveCheck
);

export const getActiveCheckProducts = createSelector(getCheckFeatureState, (state) =>
  state.activeCheck ? state.activeCheck.products : []
);

export const getChecks = createSelector(getCheckFeatureState, (state) => state.checks);

export const getActiveProduct = createSelector(
  getCheckFeatureState,
  (state) => state.activeProduct
);

export const getTotalPrice = createSelector(getCheckFeatureState, (state) =>
  state.activeCheck ? state.activeCheck.totalPrice : 0
);

export const getBasketTotalPrice = createSelector(getCheckFeatureState, (state) =>
  state.activeCheck ? state.activeCheck.basketTotalPrice : 0
);

export const getTaxAmount = createSelector(getCheckFeatureState, (state) =>
  state.activeCheck ? state.activeCheck.taxAmount : 0
);

export const getCreateCheckInProgress = createSelector(
  getCheckFeatureState,
  (state) => state.createCheckInProgress
);
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export const getSpaces = createSelector(getSpaceFeatureState, (state) => state.spaces);

export const getSelectedSpace = createSelector(
  getSpaceFeatureState,
  (state) => state.selectedSpace
);

export const getTables = createSelector(getSpaceFeatureState, (state) => state.tables);

export const getSelectedTable = createSelector(
  getSpaceFeatureState,
  (state) => state.selectedTable
);
