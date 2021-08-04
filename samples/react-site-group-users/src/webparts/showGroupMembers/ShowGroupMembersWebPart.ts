import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';

import * as strings from 'ShowGroupMembersWebPartStrings';
import ShowGroupMembers from './components/Base/ShowGroupMembers';
import { IShowGroupMembersProps } from './components/Base/IShowGroupMembersProps';

//import { SPComponentLoader } from '@microsoft/sp-loader';
import { GroupService } from '../../services/GroupService';
import { IGroup } from '../../models';

//import { sp } from "@pnp/sp/presets/all";

export interface IShowGroupMembersWebPartProps {
  description: string;
  groupName: string;
  showJobTitle: boolean;
  allowAddingMember: boolean;
}

export default class ShowGroupMembersWebPart extends BaseClientSideWebPart<IShowGroupMembersWebPartProps> {

  private _options: IPropertyPaneDropdownOption[] = [];
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  //private _groupServiceInstance: GroupService;

  // for using SPComponentLoader
  protected async onInit(): Promise<void> {
    //SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

    //GroupService.Init(this.context);

    // sp.setup({
    //   sp: {
    //       baseUrl: this.context.pageContext.web.absoluteUrl
    //   }
    // });

    // let web = await sp.web.get();
    // console.log("Web in SPFx", web.Title);
    
    // Theme friendly framework
    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    
    const _groupServiceInstance = this.context.serviceScope.consume(GroupService.serviceKey);
    // Get all the stie groups of the site
    let groups: IGroup[] = await _groupServiceInstance.getSiteGroups();
    //console.log(groups);
    
    groups.forEach(group => {
      this._options.push({
        key: group.Title,
        text: group.Title
      });
    });

    //this.context.propertyPane.refresh();   

    return super.onInit();
  }

  /**
  * Update the current theme variant reference and re-render.
  *
  * @param args The new theme
  */
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  public render(): void {
    const element: React.ReactElement<IShowGroupMembersProps> = React.createElement(
      ShowGroupMembers,
      {
        description: this.properties.description,
        groupName: this.properties.groupName,
        showJobTitle: this.properties.showJobTitle,
        allowAddingMember: this.properties.allowAddingMember,
        serviceScope: this.context.serviceScope,   // Only need to pass in serviceScope once to the top level component
        webPartContext: this.context,
        themeVariant: this._themeVariant
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [  
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  placeholder: "Group Members"
                }),              
                PropertyPaneDropdown('groupName', {
                  label: strings.GroupName,
                  options: this._options,
                  selectedKey: ""   //this._options.length > 0 ? this._options[0].text : ""
                }),
                PropertyPaneToggle('showJobTitle', {
                  key: 'showJobTitle',
                  label: strings.ShowJobTitle,
                  onText: 'Show job title',
                  offText: 'Hide job title'
                }),
                PropertyPaneToggle('allowAddingMember', {
                  key: 'allowAddingMember',
                  label: strings.AllowAddingMember,
                  checked: false,
                  onText: 'Allow user to add new member',
                  offText: 'Do not allow user to add new member'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
