export interface ICreateReturnOrderResult {
  previousAmount: number;
  newAmount: number;
  returnAmount: number;
  success: boolean;
  returnOrderId: string;
  checkId?: number;
}
