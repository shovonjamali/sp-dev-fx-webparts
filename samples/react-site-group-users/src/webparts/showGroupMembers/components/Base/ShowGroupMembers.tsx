import * as React from 'react';
import { useEffect, useState } from 'react';
//import styles from './ShowGroupMembers.module.scss';
import { IShowGroupMembersProps } from './IShowGroupMembersProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import { Card } from '../UI';
import { GroupService } from '../../../../services';
import { IMember } from '../../../../models';
import AppContext from '../../../../common/AppContext';
import { MemberGrid, MemberGridHeader, MemberGridFooter } from '../MemberDetails';

const ShowGroupMembers: React.FunctionComponent<IShowGroupMembersProps> = props => {

  const [members, setMembers] = useState([]);

  // useEffect(() => {
  //   _getGroupMemmers();
  // }, []);

  const _getGroupMembers = async() => {
    //console.log(`Group name: ${props.groupName}`);
    const groupServiceInstance = props.serviceScope.consume(GroupService.serviceKey);

    let groupMembers: IMember[] = await groupServiceInstance.getSiteGroupMembers(props.groupName);
    //console.log('Members: %O', groupMembers);
    setMembers(groupMembers);
  };

  useEffect(() => {
    _getGroupMembers();
    //setGroupName(props.groupName);
  }, [props.groupName]);

  // useEffect(() => {
  //   //console.log(props.description);
  // }, [props.description, props.allowAddingMember, props.showJobTitle]);

  const reloadMembers = () => {
    _getGroupMembers();
  };

  if(members && members.length > 0) {
    return (
      <AppContext.Provider value={{ serviceScope: props.serviceScope, webPartContext: props.webPartContext, groupName: props.groupName }}>
        <Card themeVariant={props.themeVariant}>
          <MemberGridHeader memberGridTitle={props.description} />
          <MemberGrid groupMembers={members} showJobTitleInGrid={props.showJobTitle} />
          <MemberGridFooter allowNewMemberOption={props.allowAddingMember} refreshGrid={reloadMembers} enabled={props.allowAddingMember} checked={true} />
        </Card>
      </AppContext.Provider>
    );
  }
  else
    return <></>; 
};

// simple alternate approach
// function ShowGroupMembers(props: IShowGroupMembersProps) {
//   return (
//     <div className={ styles.showGroupMembers }>
//       <div className={ styles.container }>
//         <div className={ styles.row }>
//           <div className={ styles.column }>
//             <span className={ styles.title }>Welcome to SharePoint!</span>
//             <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
//             <p className={ styles.description }>{escape(props.description)}</p>
//             <a href="https://aka.ms/spfx" className={ styles.button }>
//               <span className={ styles.label }>Learn more</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default ShowGroupMembers;