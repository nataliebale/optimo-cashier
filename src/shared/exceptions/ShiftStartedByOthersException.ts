export class ShiftStartedByOthersException extends Error {
  name = 'ShiftStartedByOthersException';
  operatorName = '';

  constructor(operatorName: string) {
    super();
    this.operatorName = operatorName;
  }
}
