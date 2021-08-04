import { ISiteUser } from "@pnp/sp/site-users";
import { ISiteUserInfo } from "@pnp/sp/site-users/types";
import { IGroup, IMember } from "../models";

export interface IGroupService {
    getSiteGroupMembers(groupName: string): Promise<IMember[]>;
    getSiteGroups(): Promise<IGroup[]>;
    addUserToGrup(groupName: string, userId: string): Promise<ISiteUserInfo>;
}