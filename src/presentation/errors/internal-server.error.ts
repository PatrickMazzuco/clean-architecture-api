export class InternalServerError extends Error {
  constructor() {
    super('Internal server error');
    this.name = this.constructor.name;
  }
}
