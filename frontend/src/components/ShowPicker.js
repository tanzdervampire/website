// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { red500, grey50 } from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

import './ShowPicker.css';

class ShowPicker extends React.Component {

    static propTypes = {
        /**
         * Fired when a show has been selected.
         * @signature (show) => void
         */
        onChange: PropTypes.func.isRequired,
    };

    state = {
        open: false,

        availableDates: null,
        minDate: null,
        maxDate: null,

        selectedDate: null,
        showsOnSelectedDate: null,
    };

    componentDidMount() {
        if (this.state.availableDates) {
            return;
        }

        fetch('/api/shows/dates', {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((dates) => {
            const l = dates.length;
            const minDate = (dates && dates[0]) ? moment(dates[0], 'YYYY-MM-DD').toDate() : null;
            const maxDate = (dates && dates[l-1]) ? moment(dates[l-1], 'YYYY-MM-DD').toDate() : null;

            this.setState({
                availableDates: dates,
                minDate: minDate,
                maxDate: maxDate,
            });
        });
    };

    onGetStartedTapped = () => {
        this.setState({ open: true });
    };

    onDateSelected = (_, date) => {
        this.setState({ selectedDate: date });

        fetch('/api/shows/' + moment(date).format('YYYY/MM/DD'), {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((shows) => {
            this.setState({ showsOnSelectedDate: shows });
        });
    };

    shouldDisableDate = (date) => {
        const { availableDates } = this.state;
        if (!availableDates) {
            return false;
        }

        return !availableDates.includes(moment(date).format('YYYY-MM-DD'));
    };

    onShowSelected = (show) => {
        this.props.onChange(show);
    };

    formatDate = (date) => {
        return moment(date).locale('de').format('dddd, DD.MM.YYYY');
    };

    renderItem(show) {
        let formattedTitle = show.type;
        if (show.time) {
            formattedTitle += ', ' + show.time;
        }

        let formattedLocation = show.location;
        if (show.theater) {
            formattedLocation += ', ' + show.theater;
        }

        return (
            <ListItem
                key={show.id}
                primaryText={formattedTitle}
                secondaryText={formattedLocation}
                onTouchTap={() => this.onShowSelected(show)}
            />
        );
    };

    renderItems() {
        const { showsOnSelectedDate } = this.state;
        if (!showsOnSelectedDate) {
            return (<div />);
        }

        if (showsOnSelectedDate.length === 0) {
            return (
                <p>Für diesen Tag gibt es aktuell leider keine Informationen.</p>
            );
        }

        return showsOnSelectedDate.map((show) => {
            return this.renderItem(show);
        });
    };

    renderList() {
        const { selectedDate, showsOnSelectedDate } = this.state;
        if (!selectedDate) {
            return (<div />);
        }

        if (!showsOnSelectedDate) {
            return (
                <CircularProgress
                    color={red500}
                />
            );
        }

        const styles = {
            showList: {
                textAlign: 'left',
            },
        };

        return (
            <Paper>
            <List style={styles.showList}>
                {this.renderItems()}
            </List>
            </Paper>
        );
    };

    render() {
        const { open, minDate, maxDate } = this.state;

        if (!open) {
            return (
                <RaisedButton
                    label="Suchen"
                    onTouchTap={this.onGetStartedTapped}
                    backgroundColor={red500}
                    labelColor={grey50}
                />
            );
        }

        const styles = {
            root: {
                maxWidth: 400,
                margin: '0 auto',
            },
        };

        return (
            <div id="show-picker-date-picker" style={styles.root}>
                <DatePicker
                    mode="landscape"
                    okLabel="OK"
                    cancelLabel="Abbrechen"
                    hintText="Wähle das Datum der Vorstellung"
                    autoOk={true}
                    formatDate={this.formatDate}
                    DateTimeFormat={global.Intl.DateTimeFormat}
                    locale="de-DE"
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={this.onDateSelected}
                    shouldDisableDate={this.shouldDisableDate}
                />
                {this.renderList()}
            </div>
        );
    };

}

export default ShowPicker;