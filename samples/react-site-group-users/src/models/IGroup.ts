export interface IGroup {
    Title: string;
    OwnerTitle: string;
    AllowMembersEditMembership: boolean;
    AllowRequestToJoinLeave: boolean;
    Description?: string;
    AutoAcceptRequestToJoinLeave: boolean;
    Id: number;
    IsHiddenInUI: boolean;
    OnlyAllowMembersViewMembership: boolean;
    PrincipalType: number;
}