import { ISurvey } from 'app/shared/model/survey.model';
import { IUser } from 'app/shared/model/user.model';

export interface ISurveyAssigment {
  id?: number;
  is_finished?: boolean | null;
  survey?: ISurvey | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ISurveyAssigment> = {
  is_finished: false,
};
