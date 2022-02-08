export class PrivilegePasswordUsedException extends Error {
    name = 'PrivilegePasswordUsedException';

    constructor(message: string = 'Password is used') {
        super(message);
        this.message = message;
    }
}
