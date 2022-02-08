import { ICheck } from '../../../../shared/types/ICheck';
import { CheckActions, CheckActionTypes } from './check.actions';
import { ICheckItem } from '../../../../shared/types/ICheckItem';

export interface CheckState {
  checks: ICheck[];
  checksError: string;
  //
  activeCheck: ICheck;
  activeCheckError: string;
  canActiveCheck: boolean;
  //
  activeProduct: ICheckItem;
  addProductError: string;
  updateProductError: string;
  removeProductError: string;
  //
  addNewCheckError: string;
  removeCheckError: string;
  clearCheckError: string;
  //
  legalEntityDataChangeError: string;
  //
  createCheckInProgress: boolean;
}

const initialState: CheckState = {
  checks: [],
  checksError: '',
  //
  activeCheck: null,
  activeCheckError: '',
  canActiveCheck: true,
  //
  activeProduct: null,
  addProductError: '',
  updateProductError: '',
  removeProductError: '',
  //
  addNewCheckError: '',
  removeCheckError: '',
  clearCheckError: '',
  //
  legalEntityDataChangeError: '',
  //
  createCheckInProgress: false,
};

export function reducer(state = initialState, action: CheckActions): CheckState {
  switch (action.type) {
    case CheckActionTypes.LoadSuccessChecks:
      return {
        ...state,
        checks: action.payload,
        createCheckInProgress: false,
      };
    case CheckActionTypes.LoadFailChecks:
      return {
        ...state,
        checksError: action.payload,
      };
    //
    case CheckActionTypes.CanActiveCheck:
      return {
        ...state,
        canActiveCheck: action.payload,
      };
    case CheckActionTypes.LoadSuccessActiveCheck:
      return {
        ...state,
        activeCheck: action.payload,
        activeProduct: state.activeProduct
          ? action.payload.products.find(
              (product) => product.stockItemId === state.activeProduct.stockItemId
            )
          : null,
      };
    case CheckActionTypes.LoadFailActiveCheck:
      return {
        ...state,
        checksError: action.payload,
      };
    //
    case CheckActionTypes.AddActiveProduct:
      let activeProduct: ICheckItem = action.payload;
      if (activeProduct) {
        activeProduct = state?.activeCheck?.products?.find(
          (prod) => prod.stockItemId === action.payload.stockItemId
        );
      }
      return {
        ...state,
        activeProduct: activeProduct,
      };
    case CheckActionTypes.AddProductError:
      return {
        ...state,
        addProductError: action.payload,
      };
    case CheckActionTypes.RemoveProductError:
      return {
        ...state,
        removeProductError: action.payload,
      };
    case CheckActionTypes.UpdateProductError:
      return {
        ...state,
        updateProductError: action.payload,
      };
    //
    case CheckActionTypes.AddNewCheckError:
      return {
        ...state,
        addNewCheckError: action.payload,
      };
    case CheckActionTypes.RemoveCheckError:
      return {
        ...state,
        removeCheckError: action.payload,
      };
    case CheckActionTypes.ClearCheckError:
      return {
        ...state,
        clearCheckError: action.payload,
      };
    //
    case CheckActionTypes.LegalEntityDataChangeError:
      return {
        ...state,
        legalEntityDataChangeError: action.payload,
      };
    //
    case CheckActionTypes.ChangeGuestNumberSuccess:
      return {
        ...state,
        activeCheck: action.payload,
      };
    case CheckActionTypes.ChangeCheckTableSuccess:
      return {
        ...state,
        activeCheck: action.payload,
      };
    case CheckActionTypes.ChangeTaxRateSuccess:
      return {
        ...state,
        activeCheck: action.payload,
      };
    case CheckActionTypes.AddCheckAndProduct:
      return {
        ...state,
        createCheckInProgress: true,
      };

    case CheckActionTypes.InitializeCheckState:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
