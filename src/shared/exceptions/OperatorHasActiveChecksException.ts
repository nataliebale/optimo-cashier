export class OperatorHasActiveChecksException extends Error {
  name = 'OperatorHasActiveChecksException';

  constructor(message: string = 'Operator has active checks') {
    super(message);
    this.message = message;
  }
}
