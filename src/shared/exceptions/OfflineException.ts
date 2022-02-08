export class OfflineException extends Error {
    name = 'OfflineException';

    constructor(message: string = 'Offline') {
        super(message);
    }
}
