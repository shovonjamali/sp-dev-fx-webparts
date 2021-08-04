import { IMember } from "../../../../models";

export interface IMemberGridProps {
    groupMembers: IMember[];
    showJobTitleInGrid?: boolean;
}