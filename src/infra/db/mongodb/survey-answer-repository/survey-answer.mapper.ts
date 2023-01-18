import { SurveyAnswerMongo } from '../models/survey-answer.model';
import { SurveyAnswer } from '@/domain/entities';

export class SurveyAnswerMapper {
  static toEntity({
    _id,
    accountId,
    surveyId,
    answer,
    date
  }: SurveyAnswerMongo): SurveyAnswer {
    return {
      id: _id.toString(),
      accountId: accountId.toString(),
      surveyId: surveyId.toString(),
      answer,
      date
    };
  }
}
