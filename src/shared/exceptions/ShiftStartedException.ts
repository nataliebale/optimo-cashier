export class ShiftStartedException extends Error {
    name = 'ShiftStartedException';

    constructor(message: string = 'Shift has already started') {
        super(message);
        this.message = message;
    }
}
