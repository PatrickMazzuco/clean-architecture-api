export abstract class Validator {
  abstract validate(input: any): Error | null;
}
