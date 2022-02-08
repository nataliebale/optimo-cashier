export class DayNotClosedException extends Error {
  name = 'DayNotClosedException';

  constructor(message: string = 'Day is not closed') {
    super(message);
    this.message = message;
  }
}
