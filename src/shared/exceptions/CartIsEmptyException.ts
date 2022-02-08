export class CartIsEmptyException extends Error {
  name = 'CartIsEmprtyException';

  constructor(message: string = 'Cart is empty') {
    super(message);
    this.message = message;
  }
}
