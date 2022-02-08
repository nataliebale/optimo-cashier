export interface OperatorDTO {
  id: number;
  name: string;
  pinCode: string;
  status: number;
  permissions: OperatorPermissionsDTO;
}

export interface OperatorPermissionsDTO {
  canReceivePurchaseOrders: boolean;
  canSetDiscount: boolean;
  canChangePrice: boolean;
  canDeleteFromBasket: boolean;
  canDeleteBasket: boolean;
  canSeeAllOrders: boolean;
  canOrder: boolean;
  canOpenShift: boolean;
  canSeeShiftSums: boolean;
  canWithdrawCash: boolean;
  canReturnOrder: boolean;
}
