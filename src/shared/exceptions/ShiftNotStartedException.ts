export class ShiftNotStartedException extends Error {
  name = 'ShiftNotStartedException';

  constructor(message: string = 'Shift not started') {
    super(message);
    this.message = message;
  }
}
