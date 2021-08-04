import * as React from 'react';

import { IMemberGridHeaderProps } from './IMemberGridHeaderProps';

export const MemberGridHeader: React.FunctionComponent<IMemberGridHeaderProps> = props => {
    return (
        <h2>{props.memberGridTitle}</h2>
    );  
};

//export default MemberGridHeader;