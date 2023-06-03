import { IUser } from 'app/shared/model/user.model';
import { IQuestion } from 'app/shared/model/question.model';

export interface IAnswer {
  id?: number;
  answer?: string | null;
  comment?: string | null;
  comment_answer?: string | null;
  user?: IUser | null;
  question?: IQuestion | null;
}

export const defaultValue: Readonly<IAnswer> = {};
