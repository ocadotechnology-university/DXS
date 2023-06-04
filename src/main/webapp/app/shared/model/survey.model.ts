import dayjs from 'dayjs';
import { IQuestion } from 'app/shared/model/question.model';
import { IUser } from 'app/shared/model/user.model';

export interface ISurvey {
  id?: number;
  name?: string;
  description?: string;
  deadline?: string | null;
  status?: string | null;
  questions?: IQuestion[] | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ISurvey> = {};
