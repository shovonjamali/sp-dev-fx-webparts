import * as React from 'react';

import { IIconProps } from '@fluentui/react';
import { ActionButton } from '@fluentui/react/lib/Button';

import { IMemberGridFooterProps } from './IMemberGridFooterProps';
import { useState } from 'react';
import { RenderPanel } from '../UI';

const addFriendIcon: IIconProps = { iconName: 'Add' };
const buttonStyles = { root: { cursor: 'pointer' } };

export const MemberGridFooter: React.FunctionComponent<IMemberGridFooterProps> = props => {
    const { enabled, checked, refreshGrid } = props;

    const [showPanel, setShowPanel] = useState(false);

    const openPanelClickHandler = () => {
        setShowPanel(true);
    };

    const closePanelClickHandler = () => {
        setShowPanel(false);
    };

    const saveClickHandler = () => {
        //console.log(`All the members have been added to the group.`);
        setShowPanel(false);
        refreshGrid();
    };

    if(enabled && checked) {
        return (
            <div>
                <ActionButton iconProps={addFriendIcon} allowDisabledFocus onClick={openPanelClickHandler} styles={buttonStyles}>
                    Add new member
                </ActionButton>
                {
                    showPanel ?
                        <RenderPanel isOpen={showPanel} onSave={saveClickHandler} onClose={closePanelClickHandler} />
                        : <></>
                }
            </div>
        );
    } else {
        return <></>;
    }
};

// function _alertClicked(): void {
//     alert('Clicked');
// }