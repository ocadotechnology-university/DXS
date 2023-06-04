import { ISurvey } from 'app/shared/model/survey.model';
import { IGroup } from 'app/shared/model/group.model';

export interface ISurveyTargetGroups {
  id?: number;
  survey?: ISurvey | null;
  group?: IGroup | null;
}

export const defaultValue: Readonly<ISurveyTargetGroups> = {};
