export class ShiftNotClosedException extends Error {
  name = 'ShiftNotClosedException';

  constructor(message: string = 'Shift not closed') {
    super(message);
    this.message = message;
  }
}
