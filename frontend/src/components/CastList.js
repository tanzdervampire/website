// @flow

import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

class CastList extends React.Component {

    static propTypes = {
        show: PropTypes.object,
    };

    renderDivider(title) {
        return (
            <Subheader
                key={title}
            >
                {title}
            </Subheader>
        );
    }

    renderItem(role, person) {
        return (
            <ListItem
                key={person.id}
                disabled={true}
                primaryText={person.name}
                secondaryText={role}
                leftAvatar={<Avatar src="images/avatar.png" />}
            />
        );
    };

    renderItems() {
        const { show } = this.props;
        if (!show || !show.cast) {
            return (
                <div />
            );
        }

        // TODO FIXME Be more flexible in terms of number of elements
        // TODO FIXME Deal with absent information
        // TODO FIXME All other roles
        const cast = show.cast;
        return [
            this.renderDivider('Hauptrollen'),
            this.renderItem('Graf von Krolock', cast['Graf von Krolock'][0]),
            this.renderItem('Alfred', cast['Alfred'][0]),
            this.renderItem('Professor Abronsius', cast['Professor Abronsius'][0]),
            this.renderItem('Sarah', cast['Sarah'][0]),
            this.renderItem('Chagal', cast['Chagal'][0]),
            this.renderItem('Magda', cast['Magda'][0]),
            this.renderItem('Rebecca', cast['Rebecca'][0]),
            this.renderItem('Herbert', cast['Herbert'][0]),
            this.renderItem('Koukol', cast['Koukol'][0]),
        ];
    };

    renderList() {
        return (
            <List>
                {this.renderItems()}
            </List>
        );
    };

    render() {
        const { show } = this.props;
        if (!show) {
            return (
                <div />
            );
        }

        const styles = {
            root: {
                maxWidth: 400,
                margin: '0 auto',
                paddingBottom: '2em',
                textAlign: 'left',
            },
        };

        return (
            <div style={styles.root}>
                <Paper>
                    {this.renderList()}
                </Paper>
            </div>
        );
    };

}

export default CastList;