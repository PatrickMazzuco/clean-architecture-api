import { Survey } from '@/domain/entities';
import { IValidator } from '@/presentation/protocols';
import {
  CompositeValidator,
  RequiredFieldValidator
} from '@/validation/validators';

type RequiredFields = Array<keyof Pick<Survey, 'question' | 'answers'>>;

export const addSurveyRequiredFields: RequiredFields = ['question', 'answers'];

export const makeAddSurveyValidator = (): IValidator => {
  const validators: IValidator[] = [];

  for (const field of addSurveyRequiredFields) {
    validators.push(new RequiredFieldValidator(field));
  }

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
