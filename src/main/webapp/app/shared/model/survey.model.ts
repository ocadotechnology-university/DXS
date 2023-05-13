import { IQuestion } from 'app/shared/model/question.model';
import { IUser } from 'app/shared/model/user.model';

export interface ISurvey {
  id?: number;
  name?: string;
  description?: string;
  questions?: IQuestion[] | null;
  users?: IUser[] | null;
}

export const defaultValue: Readonly<ISurvey> = {};
