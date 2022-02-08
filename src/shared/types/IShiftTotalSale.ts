export interface IShiftTotalSales {
  shiftId: number;
  entitySale: IShiftEntitySaleAmount;
  individualSale: IShiftIndividualSaleAmount;
}

export interface IShiftIndividualSaleAmount {
  totalAmount: number;
  totalCash: number;
  totalCard: number;
  totalManual: number;
}

export interface IShiftEntitySaleAmount {
  totalAmount: number;
  totalCash: number;
  totalCard: number;
  totalConsignation: number;
}
