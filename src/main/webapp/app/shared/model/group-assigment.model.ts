import { IUser } from 'app/shared/model/user.model';
import { IGroup } from 'app/shared/model/group.model';

export interface IGroupAssigment {
  id?: number;
  user?: IUser | null;
  group?: IGroup | null;
}

export const defaultValue: Readonly<IGroupAssigment> = {};
