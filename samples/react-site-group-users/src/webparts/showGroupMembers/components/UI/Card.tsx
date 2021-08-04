import * as React from 'react';

import { Customizer } from 'office-ui-fabric-react';

import { ICardProps } from './ICardProps';

export const Card: React.FunctionComponent <ICardProps> = props => {
    return(
        <Customizer settings={{ theme: props.themeVariant }}>
            <div data-is-scrollable>{props.children}</div>
        </Customizer> 
    );
};