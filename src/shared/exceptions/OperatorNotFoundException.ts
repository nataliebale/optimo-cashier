export class OperatorNotFoundException extends Error {
  name = 'OperatorNotFoundException';

  constructor(message: string = 'Operator not found') {
    super(message);
    this.message = message;
  }
}
