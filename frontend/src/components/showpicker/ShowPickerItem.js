// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { red500, grey50 } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class ShowPickerItem extends React.Component {

    static propTypes = {
        show: PropTypes.object.isRequired,
        onShowSelected: PropTypes.func.isRequired,
        displayDate: PropTypes.bool,
        selected: PropTypes.bool,
    };

    static defaultProps = {
        displayDate: false,
        selected: false,
    };

    formatTitle() {
        const { show, displayDate } = this.props;

        let formattedTitle = '';
        if (displayDate) {
            const formattedDate = moment(show.day, 'YYYY-MM-DD').format('DD.MM.YYYY');
            formattedTitle += formattedDate + ', ';
        }

        formattedTitle += show.type;
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
        const { show, selected } = this.props;
        const avatarLabel = show.type[0].toUpperCase();

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