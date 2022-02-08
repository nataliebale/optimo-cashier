export class OperatorAlreadyLoggedInException extends Error {
  name = 'OperatorAlreadyLoggedInException';
  
  constructor(message: string = 'Operator is logged in') {
    super(message);
    this.message = message;
  }
}
