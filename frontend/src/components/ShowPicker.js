// @flow

import React from 'react';
import PropTypes from 'prop-types';
import areIntlLocalesSupported from 'intl-locales-supported';
import moment from 'moment';
import { red500, grey50 } from 'material-ui/styles/colors';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';

import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
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

        numberOfShows: null,

        productions: null,
        minDate: null,
        maxDate: null,

        selectedDate: null,
        showsOnSelectedDate: null,

        selectedShow: null,
    };

    componentDidMount() {
        fetch('/api/shows/stats', {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((stats) => {
            this.setState({ numberOfShows: stats['count'] });
        });

        fetch('/api/productions', {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((productions) => {
            const minDate = moment(productions.sort((a, b) => {
                const startA = moment(a['start'], 'YYYY-MM-DD');
                const startB = moment(b['start'], 'YYYY-MM-DD');
                return startB.isAfter(startA) ? -1 : +1;
            })[0]['start'], 'YYYY-MM-DD').toDate();

            const maxDate = moment(productions.sort((a, b) => {
                const startA = moment(a['end'], 'YYYY-MM-DD');
                const startB = moment(b['end'], 'YYYY-MM-DD');
                return startB.isAfter(startA) ? +1 : -1;
            })[0]['end'], 'YYYY-MM-DD').toDate();

            this.setState({
                productions: productions,
                minDate: minDate,
                maxDate: maxDate,
            });
        });
    };

    onGetStartedTapped = () => {
        this.setState({ open: true });
    };

    onDateSelected = (_, date) => {
        this.setState({
            selectedDate: date,
            selectedShow: null,
        });

        fetch('/api/shows/' + moment(date).format('YYYY/MM/DD'), {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((shows) => {
            this.setState({ showsOnSelectedDate: shows });
            this.onShowSelected(shows[0]);
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
        const { selectedShow } = this.state;
        if (selectedShow === show.id) {
            /* Ignore tapping it multiple times. */
            return;
        }

        this.setState({ selectedShow: show.id });
        this.props.onChange(show);
    };

    formatDate = (date) => {
        return moment(date).locale('de').format('dddd, DD.MM.YYYY');
    };

    renderItem(show) {
        let formattedTitle = show.type;
        if (show.time) {
            formattedTitle += ', ' + show.time + ' Uhr';
        }

        let formattedLocation = show.location;
        if (show.theater) {
            formattedLocation += ', ' + show.theater;
        }

        const avatarLabel = formattedTitle[0].toUpperCase();
        const isSelected = (show.id === this.state.selectedShow);
        const avatar = (
            <Avatar
                color={isSelected ? grey50 : red500}
                backgroundColor={isSelected ? red500 : grey50}
            >
                {avatarLabel}
            </Avatar>
        );

        const style = {
            userSelect: 'none',
        };

        return (
            <ListItem
                key={show.id}
                primaryText={formattedTitle}
                secondaryText={formattedLocation}
                leftAvatar={avatar}
                onTouchTap={() => this.onShowSelected(show)}
                disabled={isSelected}
                style={style}
            />
        );
    };

    renderItems() {
        const { showsOnSelectedDate } = this.state;
        if (!showsOnSelectedDate) {
            return (<div />);
        }

        if (showsOnSelectedDate.length === 0) {
            const styles = {
                p: {
                    padding: 20,
                },
            };

            return (
                <p style={styles.p}>Für diesen Tag gibt es aktuell leider keine Informationen.</p>
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
            p: {
                paddingTop: 20,
            },
            showList: {
                textAlign: 'left',
            },
        };

        return (
            <Paper>
                { showsOnSelectedDate.length === 1 && (
                    <p style={styles.p}>An diesem Tag fand folgende Vorstellung statt</p>
                ) }
                { showsOnSelectedDate.length > 1 && (
                    <p style={styles.p}>Wähle eine der Vorstellungen an diesem Tag</p>
                ) }
                <List style={styles.showList}>
                    {this.renderItems()}
                </List>
            </Paper>
        );
    };

    render() {
        const { open, numberOfShows, minDate, maxDate } = this.state;
        const displayedNumberOfShows = numberOfShows ? 100 * Math.floor(numberOfShows / 100) : 2000;

        if (!open) {
            return (
                <div>
                    <p>
                        Wähle aus {displayedNumberOfShows.toLocaleString()}+ Vorstellungen und finde heraus, welcher Cast an einem bestimmten Tag gespielt hat.
                    </p>
                    <RaisedButton
                        label="Cast finden"
                        onTouchTap={this.onGetStartedTapped}
                        backgroundColor={red500}
                        labelColor={grey50}
                    />
                </div>
            );
        }

        let DateTimeFormat;
        if (areIntlLocalesSupported(['de'])) {
            DateTimeFormat = global.Intl.DateTimeFormat;
        } else {
            const IntlPolyfill = require('intl');
            DateTimeFormat = IntlPolyfill.DateTimeFormat;
            require('intl/locale-data/jsonp/de');
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
                    mode={this.props.width === LARGE ? "landscape" : "portrait"}
                    okLabel="OK"
                    cancelLabel="Abbrechen"
                    hintText="Wähle das Datum der Vorstellung"
                    autoOk={true}
                    formatDate={this.formatDate}
                    DateTimeFormat={DateTimeFormat}
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

export default withWidth()(ShowPicker);