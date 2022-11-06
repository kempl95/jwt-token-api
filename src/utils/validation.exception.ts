export class ValidationException extends Error {
  get status() {
    return this._status;
  }
  private readonly _status: number;

  constructor(message, status) {
    super(message);
    this._status = status
  }
}