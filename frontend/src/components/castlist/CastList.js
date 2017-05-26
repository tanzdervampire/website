// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { red500, grey50 } from 'material-ui/styles/colors';

import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import SwipeableViews from 'react-swipeable-views';

class CastList extends React.Component {

    static propTypes = {
        show: PropTypes.object,
    };

    state = {
        slideIndex: 0,
    };

    handleChange = (value) => {
        this.setState({ slideIndex: value });
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

    renderAvatar(person) {
        const initial = person.name[0].toUpperCase();
        return (
            <Avatar
                backgroundColor={red500}
            >
                {initial}
            </Avatar>
        );
    };

    renderItem(role, person, hideRole = false) {
        /* The same person can appear in more than one role, so mix both keys. */
        const key = role + person.name;

        return (
            <ListItem
                key={key}
                disabled={true}
                primaryText={person.name}
                secondaryText={hideRole ? null : role}
                leftAvatar={this.renderAvatar(person)}
            />
        );
    };

    renderMainCastItemsForRole(role) {
        const { show } = this.props;
        if (!show.cast[role] || show.cast[role].length === 0) {
            return [this.renderItem(role, {
                'id': 0,
                'name': 'Unbekannt',
            })];
        }

        return show.cast[role].map((person) => {
            return this.renderItem(role, person);
        });
    };

    renderMainCastList() {
        const { show } = this.props;
        if (!show) {
            return (
                <div />
            );
        }

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
                return this.renderItem(key, person, true);
            })
        );
    };

    renderEnsembleList() {
        const { show } = this.props;
        if (!show) {
            return (
                <div />
            );
        }

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
            tabs: {
                backgroundColor: red500,
            },
            inkBar: {
                backgroundColor: grey50,
            },
        };

        return (
            <div style={styles.root}>
                <Paper>
                    <Tabs
                        onChange={this.handleChange}
                        value={this.state.slideIndex}
                        tabItemContainerStyle={styles.tabs}
                        inkBarStyle={styles.inkBar}
                    >
                        <Tab label="Besetzung" value={0} />
                        <Tab label="Ensemble & Solisten" value={1} />
                    </Tabs>
                    <SwipeableViews
                        index={this.state.slideIndex}
                        onChangeIndex={this.handleChange}
                    >
                        <div>
                            <List>
                                {this.renderMainCastList()}
                            </List>
                        </div>
                        <div>
                            <List>
                                {this.renderEnsembleList()}
                            </List>
                        </div>
                    </SwipeableViews>
                </Paper>
            </div>
        );
    };

}

export default CastList;