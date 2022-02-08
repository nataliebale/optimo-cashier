export class DayClosedException extends Error {
  name = 'DayClosedException';

  constructor(message: string = 'Day is closed') {
    super(message);
    this.message = message;
  }
}
