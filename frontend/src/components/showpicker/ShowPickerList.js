// @flow

import React from 'react';
import PropTypes from 'prop-types';

import { red500 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import ShowPickerItem from './ShowPickerItem';

class ShowPickerList extends React.Component {

    static propTypes = {
        shows: PropTypes.array,
        selectedShow: PropTypes.object,
        selectedDate: PropTypes.instanceOf(Date).isRequired,
    };

    onShowSelected = (show) => {
        const { location, time } = show;
        const [ year, month, day ] = show['day'].split(/-/);
        this.props.history.push(`/shows/${location}/${day}/${month}/${year}/${time}`);
    };

    renderItems() {
        const { shows } = this.props;
        if (!shows) {
            return (<div />);
        }

        if (shows.length === 0) {
            const styles = {
                p: {
                    padding: 20,
                },
            };

            return (
                <p style={styles.p}>Für diesen Tag gibt es aktuell leider keine Informationen.</p>
            );
        }

        return shows.map((show) => {
            return (
                <ShowPickerItem
                    key={show.id}
                    show={show}
                    selected={this.props.selectedShow && show.id === this.props.selectedShow.id}
                    onShowSelected={this.onShowSelected}
                />
            );
        });
    };

    render() {
        const { shows } = this.props;
        if (!this.props.selectedDate) {
            return (<div />);
        }

        if (!shows) {
            return (
                <CircularProgress
                    color={red500}
                />
            );
        }

        const styles = {
            p: {
                paddingTop: 20,
            },
            showList: {
                textAlign: 'left',
            },
        };

        return (
            <Paper>
                { shows.length === 1 && (
                    <p style={styles.p}>An diesem Tag fand folgende Vorstellung statt</p>
                ) }
                { shows.length > 1 && (
                    <p style={styles.p}>Wähle eine der Vorstellungen an diesem Tag</p>
                ) }
                <List style={styles.showList}>
                    {this.renderItems()}
                </List>
            </Paper>
        );
    };
}

export default ShowPickerList;