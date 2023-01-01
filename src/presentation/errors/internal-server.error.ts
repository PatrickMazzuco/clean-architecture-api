export class InternalServerError extends Error {
  constructor(stack?: string) {
    super('Internal server error');
    this.name = this.constructor.name;
    this.stack = stack;
  }
}
