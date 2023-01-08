import { IValidator } from '@/presentation/protocols/validator';

export class CompositeValidator implements IValidator {
  constructor(private readonly validators: IValidator[]) {}

  validate(input: any): Error | null {
    for (const validator of this.validators) {
      const error = validator.validate(input);
      if (error) {
        return error;
      }
    }
    return null;
  }
}
