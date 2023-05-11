import { ISurvey } from 'app/shared/model/survey.model';

export interface IQuestion {
  id?: number;
  category?: string;
  answerType?: string;
  questionContent?: string;
  isRequired?: boolean;
  survey?: ISurvey | null;
}

export const defaultValue: Readonly<IQuestion> = {
  isRequired: false,
};
