import { SurveyMongo } from '../models/survey.model';
import { Survey } from '@/domain/entities';

export class SurveyMapper {
  static toEntity({ _id, question, options, date }: SurveyMongo): Survey {
    return {
      id: _id.toString(),
      question,
      options,
      date
    };
  }
}
