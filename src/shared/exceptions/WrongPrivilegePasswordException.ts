export class WrongPrivilegePasswordException extends Error {
    name = 'WrongPrivilegePasswordException';

    constructor(message: string = 'Wrong password') {
        super(message);
        this.message = message;
    }
}
