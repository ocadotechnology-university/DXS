import { IQuestion } from 'app/shared/model/question.model';

export interface ISurvey {
  id?: number;
  name?: string;
  description?: string;
  questions?: IQuestion[] | null;
}

export const defaultValue: Readonly<ISurvey> = {};
