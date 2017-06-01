// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { red500, grey50 } from 'material-ui/styles/colors';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class CastListItem extends React.Component {

    static propTypes = {
        role: PropTypes.string.isRequired,
        displayRole: PropTypes.bool.isRequired,
        person: PropTypes.object.isRequired,
        missingNamePlaceholder: PropTypes.string,
    };

    renderAvatar() {
        const { person, missingNamePlaceholder } = this.props;

        const hasName = person.name
            && person.name.length !== 0
            && person.name !== missingNamePlaceholder;

        const initial = hasName ? person.name[0].toUpperCase() : '?';
        return (
            <Avatar
                color={hasName ? grey50 : red500}
                backgroundColor={hasName ? red500 : grey50}
            >
                {initial}
            </Avatar>
        );
    };

    render() {
        const { role, displayRole, person } = this.props;

        return (
            <ListItem
                style={{ cursor: 'default' }}
                disabled={true}
                primaryText={person.name}
                secondaryText={displayRole ? role : null}
                leftAvatar={this.renderAvatar(person)}
            />
        );
    };

}

export default CastListItem;