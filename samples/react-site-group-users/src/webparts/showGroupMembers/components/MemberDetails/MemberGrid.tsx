import * as React from 'react';
import { IMember } from '../../../../models';
import { IMemberGridProps } from "./IMemberGridProps";

import { Persona, PersonaSize } from '@fluentui/react';

export const MemberGrid: React.FunctionComponent<IMemberGridProps> = props => {
    return(
        <>
        {
            props.groupMembers.map((member: IMember, index) => (
              //return(
              <div key={index}>
                <Persona 
                  imageUrl={member.PictureUrl}                      
                  text={member.Title}
                  secondaryText={props.showJobTitleInGrid ? member.JobTitle : ""}
                  size={PersonaSize.size48}
                  hidePersonaDetails={false}                      
                  imageAlt={member.LoginName}                    
                />
                <br></br>
              </div>                 
              //);                       
            ))            
        }
        </>
    );
};

//export default MemberGrid;