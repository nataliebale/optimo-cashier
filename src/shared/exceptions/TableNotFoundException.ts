export class TableNotFoundException extends Error {
  name = 'TableNotFoundException';

  constructor(message: string = 'Table not found') {
    super(message);
    this.message = message;
  }
}
