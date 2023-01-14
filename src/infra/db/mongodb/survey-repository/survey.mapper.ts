import { SurveyMongo } from '../models/survey.model';
import { Survey } from '@/domain/entities';

export class SurveyMapper {
  static toEntity({ _id, question, answers, date }: SurveyMongo): Survey {
    return {
      id: _id.toString(),
      question,
      answers,
      date
    };
  }
}
