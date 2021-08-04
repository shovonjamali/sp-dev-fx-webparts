import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
//import { useBoolean } from '@fluentui/react-hooks';
import { IRenderPanelProps } from './IRenderPanelProps';
import { useContext, useState, useEffect } from 'react';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { MessageBar, MessageBarType, Checkbox, Stack } from '@fluentui/react';

import AppContext from '../../../../common/AppContext';
import { IUserDetail } from '../../../../models';
import { GroupService, UtilityService } from '../../../../services';
import { Constants } from '../../../../common/Constants';

const buttonStyles = { root: { marginRight: 8 } };
const stackTokens = { childrenGap: 20 };

let _members: IUserDetail[] = [];

export const RenderPanel: React.FunctionComponent <IRenderPanelProps> = props => {
  
  const { isOpen, onSave, onClose } = props;

  const { webPartContext, serviceScope, groupName } = useContext(AppContext);
  
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageBarType, setMessageBarType] = useState(0);
  const [sendNotification, setSendNotification] = useState(false);

  const _groupServiceInstance = serviceScope.consume(GroupService.serviceKey);
  const _utilityServiceInstance = serviceScope.consume(UtilityService.serviceKey);

  useEffect(() => {
    return () => {
      //console.log(`Cleanup`);
      _members = [];
    };
  }, []);

  const _checkRequiredValidation = (): boolean => {
    //const requiredMessage: string = `Please select an user.`;

    if(_members.length === 0) {
      setShowMessage(true);
      setMessageBarType(MessageBarType.warning);
      setMessage(Constants.requiredMessage);
      return false;
    }

    return true;
  };

  const _checkAddedMembers = (results: any[]): boolean => {
    let count = 0;
    results.forEach(userInfo => {
      if(!userInfo) {
        count++;
      }
    });

    //console.log(`Error Count: ${count}`);
    //console.log(`Results length: ${results.length}`);

    if(count == results.length)
      return false;

    return true;
  };

  const _renderMessage = (results: any[]): void => {
    setShowMessage(true);

    if(_checkAddedMembers(results)) {
      setMessageBarType(MessageBarType.success);
      setMessage(Constants.successMessage);

      setTimeout(() => {
        onSave();
      }, Constants.timeOutDuration);
    }
    else {
      setMessageBarType(MessageBarType.error);
      setMessage(Constants.failedMessage);
    }
  };

  const saveGroupMembersHandler = async (): Promise<void> => {
    let promises: any[] = [];

    if(!_checkRequiredValidation()) 
      return;    
    
    _members.forEach(member => {
      promises.push(_groupServiceInstance.addUserToGrup(groupName, member.ID));
    });
    
    const results = await Promise.all(promises);
    //console.log(results);
    
    if(sendNotification) {
      const emailResults = await _utilityServiceInstance.sendNotification(results);
      //console.log(emailResults);
    }

    _renderMessage(results);
  };

  const sendNotificationHandler = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean): void => {
    //console.log(`The option has been changed to ${isChecked}.`);
    setSendNotification(isChecked);
  };

  const _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={saveGroupMembersHandler} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={onClose}>Cancel</DefaultButton>
      </div>
    );
  };

  const _getPeoplePickerItems = (items: any[]) => {
    //console.log('Items:', items);
    _members = [];
    setShowMessage(false);

    items.forEach(user => {
      _members.push({ 
        ID: user.id, 
        LoginName: user.loginName, 
        SecondaryText: user.secondaryText, 
        Text: user.text,
        ImageInitials: user.imageInitials,
        ImageUrl: user.imageUrl,
        OptionalText: user.optionalText,
        TertiaryText: user.tertiaryText
      });
    });
  };

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={onClose}
        headerText="Add new members"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={_onRenderFooterContent}
        // Stretch panel content to fill the available height so the footer is positioned
        // at the bottom of the page
        isFooterAtBottom={true}
      >
        {/* <p>Content goes here.</p> */}
        <Stack tokens={stackTokens}>
          <PeoplePicker
            context={webPartContext}
            titleText="Find user"
            personSelectionLimit={3}
            groupName={""} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            required={true}
            disabled={false}
            onChange={_getPeoplePickerItems}
            showHiddenInUI={false}
            
            principalTypes={[PrincipalType.User, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
            resolveDelay={1000} />

            <Checkbox label="Send an email invitation" onChange={sendNotificationHandler} />

            {
              showMessage && 
                <MessageBar messageBarType={messageBarType} isMultiline={true} >
                  {message}
                </MessageBar>
            }
        </Stack>
      </Panel>      
    </div>
  );
};

// function _onChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
//   console.log(`The option has been changed to ${isChecked}.`);
// }