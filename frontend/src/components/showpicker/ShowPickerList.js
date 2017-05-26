// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { red500 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import ShowPickerItem from './ShowPickerItem';

class ShowPickerList extends React.Component {

    static propTypes = {
        date: PropTypes.instanceOf(Date).isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        shows: null,
        selectedShow: null,
    };

    componentDidMount() {
        this.loadShows(this.props.date);
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.date !== nextProps.date) {
            this.loadShows(nextProps.date);
        }
    };

    loadShows(date) {
        fetch('/api/shows/' + moment(date).format('YYYY/MM/DD'), {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((shows) => {
            this.setState({
                shows: shows,
                selectedShow: null,
            });

            this.onShowSelected(shows ? shows[0] : null);
        });
    };

    onShowSelected = (show) => {
        const { selectedShow } = this.state;
        if (!show || selectedShow === show.id) {
            /* Ignore tapping it multiple times. */
            return;
        }

        this.setState({ selectedShow: show.id });
        this.props.onChange(show);
    };

    renderItems() {
        const { shows } = this.state;
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
                    selected={show.id === this.state.selectedShow}
                    onShowSelected={this.onShowSelected}
                />
            );
        });
    };

    render() {
        const { shows } = this.state;
        if (!this.props.date) {
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