export class OperatorNotAuthedException extends Error {
  name = 'OperatorNotAuthedException';

  constructor(message: string = 'Operator not authed') {
    super(message);
    this.message = message;
  }
}
