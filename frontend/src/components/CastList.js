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

    renderMainCastItemsForRole(role) {
        const { show } = this.props;
        if (!show.cast[role] || show.cast[role].length === 0) {
            return [this.renderItem(role, {
                'id': role + Math.random(),
                'name': 'Unbekannt',
            })];
        }

        return show.cast[role].map((person) => {
            return this.renderItem(role, person);
        });
    };

    renderMainCastList() {
        const { show } = this.props;
        if (!show || !show.cast) {
            return (
                <div />
            );
        }

        const cast = show.cast;
        return [
            this.renderDivider('Hauptrollen'),
            ...this.renderMainCastItemsForRole('Graf von Krolock'),
            ...this.renderMainCastItemsForRole('Alfred'),
            ...this.renderMainCastItemsForRole('Professor Abronsius'),
            ...this.renderMainCastItemsForRole('Sarah'),
            ...this.renderMainCastItemsForRole('Chagal'),
            ...this.renderMainCastItemsForRole('Magda'),
            ...this.renderMainCastItemsForRole('Rebecca'),
            ...this.renderMainCastItemsForRole('Herbert'),
            ...this.renderMainCastItemsForRole('Koukol'),

            this.renderDivider('Dirigent'),
            ...this.renderMainCastItemsForRole('Dirigent'),
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