export class AccessDeniedError extends Error {
  constructor() {
    super('Access Denied');
    this.name = this.constructor.name;
  }
}
