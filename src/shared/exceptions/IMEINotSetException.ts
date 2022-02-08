export class IMEINotSetException extends Error {
  name = 'IMEINotSetException';

  constructor(message: string = 'One ore more IMEIS not set') {
    super(message);
    this.message = message;
  }
}
