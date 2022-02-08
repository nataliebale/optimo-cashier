export class OrderIdExistsException extends Error {
    name = 'OrderIdExistsException';

    constructor(message: string = 'Order id exists') {
        super(message);
        this.message = message;
    }
}
