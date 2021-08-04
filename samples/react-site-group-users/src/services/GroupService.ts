import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';
import { PageContext } from '@microsoft/sp-page-context';
//import { BaseWebPartContext } from '@microsoft/sp-webpart-base';
//import { WebPartContext } from "@microsoft/sp-webpart-base";

import { ISiteUser, sp } from "@pnp/sp/presets/all";
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

import { IMember, IGroup, IProfile } from "../models";
import { IGroupService } from './IGroupService';

export class GroupService implements IGroupService {

    public static readonly serviceKey: ServiceKey<IGroupService> = ServiceKey.create<IGroupService>('rsgu:IGroupService', GroupService);

    private _pageContext: PageContext;

    // public static Init(spcontext: WebPartContext) {
    //     sp.setup({  
    //         spfxContext: spcontext  
    //     });
    // }

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {          
            this._pageContext = serviceScope.consume(PageContext.serviceKey);
            sp.setup({
                sp: {
                    baseUrl: this._pageContext.web.absoluteUrl
                }
            });
        });        
    }

    public async getSiteGroupMembers(groupName: string): Promise<IMember[]> {      
        try{
            let allMembers: any = await sp.web.siteGroups.getByName(groupName).users.get();
            //console.log(allMembers);

            let promises: any[] = [];
            allMembers.forEach((member: IMember) => {
                promises.push(this._getUserPhoto(member.LoginName));
            });

            const profiles: IProfile[] = await Promise.all(promises);

            let members: IMember[] = [];
            for(let i = 0; i < allMembers.length; i++) {
                let member = allMembers[i];
                let profile = profiles[i];
                
                members.push({ 
                    Title: member.Title, 
                    Id: member.Id,
                    PictureUrl: profile.PictureUrl,
                    JobTitle: profile.Title
                });
            }
            
            // for(const member of allMembers) {
            //     const loginName = member.LoginName;
            //     const profile: IProfile = await this._getUserPhoto(loginName);
            //     //console.log(profile.PictureUrl);
            //     members.push({ 
            //         Title: member.Title, 
            //         Id: member.Id,
            //         PictureUrl: profile.PictureUrl,
            //         JobTitle: profile.Title
            //     });                
            // }

            // allMembers.forEach((member: IMember) => {
            //     const loginName = member.LoginName;
            //     this.getUserPhoto(loginName).then((profile: IProfile) => {
            //         members.push({ 
            //             Title: member.Title, 
            //             Id: member.Id,
            //             PictureUrl: '',//profile.PictureUrl,
            //             JobTitle: ''//profile.Title
            //         });
            //     }).catch(err => {
            //         console.log(`Error from getSiteGroupMembers() while fetching user profile. Error: ${err}`);
            //     });            
            // });

            //console.log(members);     
            return members;
        }  
        catch (err) {
            console.log(`Error from getSiteGroupMembers(). Error: ${err}`);
            return undefined;
        }
    }

    private async _getUserPhoto(loginName: string): Promise<IProfile> {
        try {
            const profile: IProfile = await sp.profiles.getPropertiesFor(loginName);
            //console.log(profile);
            return profile;
        }
        catch(err) {
            console.log(`Error occured while getting photo of: ${loginName}. Error: ${err}`);
            return undefined;
        }
    }

    public async getSiteGroups(): Promise<IGroup[]> {
        try {
            let allGroups: any = await sp.web.siteGroups.get();
            //console.log(allGroups);
            let groups: IGroup[] = [];
            allGroups.forEach((group: IGroup) => {                
                groups.push({ 
                    Title: group.Title,
                    OwnerTitle: group.OwnerTitle,
                    AllowMembersEditMembership: group.AllowMembersEditMembership,
                    AllowRequestToJoinLeave: group.AllowRequestToJoinLeave,
                    Description: group.Description,
                    AutoAcceptRequestToJoinLeave: group.AutoAcceptRequestToJoinLeave,
                    Id: group.Id,
                    IsHiddenInUI: group.IsHiddenInUI,
                    OnlyAllowMembersViewMembership: group.OnlyAllowMembersViewMembership,
                    PrincipalType: group.PrincipalType
                });                           
            });
            //console.log(groups);     
            return groups;
        }
        catch(err) {
            console.log(`Error from getSiteGroups(). Error: ${err}`);
        }
    }

    public async addUserToGrup(groupName: string, userId: string): Promise<ISiteUserInfo> {      
        // return sp.web.siteGroups.getByName(groupName).users.add(userId).then((d: ISiteUser) => {
        //     //console.log(d);
        //     return d.select("Id").get().then((userData: ISiteUserInfo) => {
        //         //console.log(userData);
        //         return userData;
        //     });
        // });
        try {
            const siteUser: ISiteUser = await sp.web.siteGroups.getByName(groupName).users.add(userId);

            const siteUserInfo: ISiteUserInfo = await siteUser.select("Id, Email").get();

            return siteUserInfo;
            //throw new Error(`Something bad happened`);
        }
        catch(err) {
            return undefined;   //null;
        }
    }
}