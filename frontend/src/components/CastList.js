// @flow

import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
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

    renderMainCastList() {
        const { show } = this.props;
        if (!show || !show.cast) {
            return (
                <div />
            );
        }

        // TODO FIXME Be more flexible in terms of number of elements
        // TODO FIXME Deal with absent information
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
            this.renderDivider('Dirigent'),
            this.renderItem('Dirigent', cast['Dirigent'][0]),
        ];
    };

    renderEnsembleGroup(label, key) {
        const { show } = this.props;
        if (!show.cast[key] || show.cast[key].length === 0) {
            return [];
        }

        const divider = this.renderDivider(label);
        return [divider].concat(
            show.cast[key].map((person) => {
                return this.renderItem('', person);
            })
        );
    };

    renderEnsembleList() {
        const { show } = this.props;
        if (!show || !show.cast) {
            return (
                <div />
            );
        }

        const cast = show.cast;
        return [
            ...this.renderEnsembleGroup('Tanzsolisten', 'Solotänzer'),
            ...this.renderEnsembleGroup('Gesangssolisten', 'Gesangssolisten'),
            ...this.renderEnsembleGroup('Tanzensemble', 'Tanzensemble'),
            ...this.renderEnsembleGroup('Gesangsensemble', 'Gesangsensemble'),
        ];
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
                    <Tabs>
                        <Tab label="Besetzung">
                            <List>
                                {this.renderMainCastList()}
                            </List>
                        </Tab>
                        <Tab label="Ensemble & Solisten">
                            <List>
                                {this.renderEnsembleList()}
                            </List>
                        </Tab>
                    </Tabs>
                </Paper>
            </div>
        );
    };

}

export default CastList;