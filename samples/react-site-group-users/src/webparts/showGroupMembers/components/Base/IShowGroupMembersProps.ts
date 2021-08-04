import { ServiceScope } from '@microsoft/sp-core-library';
//import { BaseWebPartContext, WebPartContext } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IShowGroupMembersProps {
  description: string;
  groupName: string;
  showJobTitle?: boolean;
  allowAddingMember?: boolean;
  serviceScope: ServiceScope;
  webPartContext: any;
  themeVariant: IReadonlyTheme | undefined;
}