// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { red500, grey50 } from 'material-ui/styles/colors';

import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import SwipeableViews from 'react-swipeable-views';

import CastListItem from './CastListItem';

class CastList extends React.Component {

    static propTypes = {
        show: PropTypes.object,
        missingMainCastName: PropTypes.string,
    };

    state = {
        slideIndex: 0,
    };

    defaultProps = {
        missingMainCastName: 'Unbekannt',
    };

    componentWillReceiveProps(nextProps) {
        /* Select the first tab if the date has changed. */
        if (!this.props.show || !nextProps.show || this.props.show.day !== nextProps.show.day) {
            this.setState({ slideIndex: 0 });
        }
    };

    handleChange = value => {
        this.setState({ slideIndex: value });
    };

    renderDivider(title) {
        const key = `divider-${title}`;
        return (
            <Subheader
                key={key}
            >
                {title}
            </Subheader>
        );
    }

    getItemKey(role, person) {
        /* The same person can appear in more than one role, so mix both keys. */
        return role + person.name;
    };

    renderMainCastItemsForRole(role) {
        const { show, missingMainCastName } = this.props;
        const persons = (show.cast[role] && show.cast[role].length !== 0) ? show.cast[role] : [{
            id: 0,
            name: missingMainCastName,
        }];

        return persons.map(person => {
            return (
                <CastListItem
                    key={this.getItemKey(role, person)}
                    role={role}
                    displayRole={true}
                    person={person}
                />
            );
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
            show.cast[key].map(person => {
                return (
                    <CastListItem
                        key={this.getItemKey(key, person)}
                        role={key}
                        displayRole={false}
                        person={person}
                    />
                );
            })
        );
    };

    renderEmptyEnsembleList() {
        return (
            <div style={{ textAlign: 'center' }}>
                <p>Für das Ensemble liegen keine Informationen vor.</p>
            </div>
        );
    };

    renderEnsembleList() {
        const { show } = this.props;
        if (!show) {
            return this.renderEmptyEnsembleList();
        }

        const ensemble = [
            ...this.renderEnsembleGroup('Tanzsolisten', 'Solotänzer'),
            ...this.renderEnsembleGroup('Tanzsolisten', 'Tanzsolisten'),
            ...this.renderEnsembleGroup('Gesangssolisten', 'Gesangssolisten'),
            ...this.renderEnsembleGroup('Tanzensemble', 'Tanzensemble'),
            ...this.renderEnsembleGroup('Gesangsensemble', 'Gesangsensemble'),
        ];

        if (ensemble.length === 0) {
            return this.renderEmptyEnsembleList();
        }

        return ensemble;
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
                        animateHeight={true}
                        resistance={true}
                        enableMouseEvents={true}
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