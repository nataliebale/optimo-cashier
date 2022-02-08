export class ModelValidationException extends Error {
  name = 'ModelValidationException';

  constructor(message: string = 'Model validation exception') {
    super(message);
  }
}
