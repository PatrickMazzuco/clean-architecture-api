import {
  addSurveyRequiredFields,
  makeAddSurveyValidator
} from './add-survey-validator.factory';
import { IValidator } from '@/presentation/protocols';
import { CompositeValidator } from '@/validation/validators/composite.validator';
import { RequiredFieldValidator } from '@/validation/validators/required-field.validator';

jest.mock('@/validation/validators/composite.validator');

describe('AddSurvey Validator', () => {
  it('should call CompositeValidator with all validators', () => {
    makeAddSurveyValidator();

    const validators: IValidator[] = [];
    for (const field of addSurveyRequiredFields) {
      validators.push(new RequiredFieldValidator(field));
    }

    expect(CompositeValidator).toHaveBeenCalledWith(validators);
  });
});
