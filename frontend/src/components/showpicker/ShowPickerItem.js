// @flow

import React from 'react';
import PropTypes from 'prop-types';

import { red500, grey50 } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class ShowPickerItem extends React.Component {

    static propTypes = {
        show: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        onShowSelected: PropTypes.func.isRequired,
    };

    formatTitle() {
        const { show } = this.props;

        let formattedTitle = show.type;
        if (show.time) {
            formattedTitle += ', ' + show.time + ' Uhr';
        }

        return formattedTitle;
    };

    formatLocation() {
        const { show } = this.props;

        let formattedLocation = show.location;
        if (show.theater) {
            formattedLocation += ', ' + show.theater;
        }

        return formattedLocation;
    };

    formatAvatar() {
        const { selected } = this.props;
        const avatarLabel = this.formatTitle()[0].toUpperCase();

        return (
            <Avatar
                color={selected ? grey50 : red500}
                backgroundColor={selected ? red500 : grey50}
            >
                {avatarLabel}
            </Avatar>
        );
    };

    render() {
        const { show, selected } = this.props;

        const style = {
            userSelect: 'none',
        };

        return (
            <ListItem
                primaryText={this.formatTitle()}
                secondaryText={this.formatLocation()}
                leftAvatar={this.formatAvatar()}
                onTouchTap={() => this.props.onShowSelected(show)}
                disabled={selected}
                style={style}
            />
        );
    };
}

export default ShowPickerItem;