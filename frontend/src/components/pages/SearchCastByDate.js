// @flow

import React from 'react';
import moment from 'moment';
import typography from 'material-ui/styles/typography';
import spacing from 'material-ui/styles/spacing';
import { red500, grey50 } from 'material-ui/styles/colors';

import FullWidthSection from '../../FullWidthSection';
import ShowPicker from '../showpicker/ShowPicker';
import CastList from '../castlist/CastList';

class SearchCastByDate extends React.Component {

    state = {
        /* The selected date in the date picker. */
        selectedDate: null,
        /* The list of shows available for the selected date. */
        shows: null,
        /* The show selected from the list. */
        selectedShow: null,
    };

    componentDidMount() {
        const { location, day, month, year, time } = this.props.match.params;

        /* If a show was given in the URL, make sure we load all information right away. */
        if (location && day && month && year && time) {
            this.loadShows(location, day, month, year, time);
        }
    };

    componentWillReceiveProps(nextProps) {
        const { location, day, month, year, time } = nextProps.match.params;

        /* If the date itself doesn't change we don't need to fetch the shows again; however, we do need to set the
         * selected show anyway (think switching between the available shows). We compare against our selected date
          * rather than the previous props because the latter are only available on URL-driven requests. */
        if (this.state.selectedDate && [day, month, year].join('.') === moment(this.state.selectedDate).format('DD.MM.YYYY')) {
            this.setState({ selectedShow: this.getShowToSelect(this.state.shows, location, time) });
            return;
        }

        this.setState({ shows: null, selectedShow: null });
        if (location && day && month && year && time) {
            this.loadShows(location, day, month, year, time);
        }
    };

    loadShows(location, day, month, year, time, callback = () => {}) {
        fetch(`/api/shows/${year}/${month}/${day}`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(shows => {
            this.setState({
                shows: shows,
                selectedDate: moment(`${day}.${month}.${year}`, 'DD.MM.YYYY').toDate(),
                selectedShow: this.getShowToSelect(shows, location, time),
            });

            callback();
        }).catch(err => {
            console.log(`Failed to get shows on ${day}.${month}.${year}, error message: ${err.message}`);
        });
    };

    onDateChange = date => {
        this.setState({
            shows: null,
            selectedDate: date,
            selectedShow: null,
        });
        const [ day, month, year ] = moment(date).format('DD.MM.YYYY').split(/\./);
        this.loadShows(null, day, month, year, null, () => {
            /* If we're not coming from a URL request, redirect properly after loading the shows so that the URL
             * is changed. */
            if (!this.props.match.params.year && this.state.selectedShow) {
                const { selectedShow } = this.state;
                const { location, time } = selectedShow;
                const [ year, month, day ] = selectedShow['day'].split(/-/);
                this.props.history.push(`/show/${location}/${day}/${month}/${year}/${time}`);
            }
        });
    };

    getShowToSelect(shows, location, time) {
        /* If we have no shows yet, there's nothing to select. */
        if (!shows || shows.length === 0) {
            return null;
        }

        /* When we're not coming from a URL we have no location and time, so just select the first one. */
        if (!location || !time) {
            return shows[0];
        }

        /* We're coming from a URL, so try and select the correct show. */
        const filtered = shows.filter(show => {
            return show['location'] === location && show['time'] === time;
        });

        if (filtered.length === 1) {
            /* This is what we'd usually expect. */
            return filtered[0];
        } else if (filtered.length === 0) {
            console.log('Could not find any show matching all given criteria.');
            return shows[0];
        } else {
            console.log('Found more than one show matching the given criteria.');
            return filtered[0];
        }
    };

    header() {
        const styles = {
            root: {
                textAlign: 'center',
                backgroundColor: red500,
                overflow: 'hidden',
                paddingTop: 0.5 * spacing.desktopGutter,
                paddingBottom: spacing.desktopGutter * 2,
            },
            h1: {
                color: grey50,
                fontWeight: typography.fontWeightLight,
                fontSize: 48,
            },
            h2: {
                fontSize: 24,
            },
        };

        styles.h2 = Object.assign({}, styles.h1, styles.h2);

        return (
            <FullWidthSection style={styles.root}>
                <h1 style={styles.h1}>
                    Tanz der Vampire
                </h1>
                <h2 style={styles.h2}>
                    Castlisten
                </h2>
            </FullWidthSection>
        );
    };

    search() {
        const styles = {
            root: {
                textAlign: 'center',
                backgroundColor: grey50,
                overflow: 'hidden',
            },
        };

        return (
            <FullWidthSection style={styles.root}>
                <ShowPicker
                    {...this.props}
                    selectedDate={this.state.selectedDate}
                    shows={this.state.shows}
                    selectedShow={this.state.selectedShow}
                    onDateSelected={this.onDateChange}
                />
            </FullWidthSection>
        );
    };

    content() {
        const { selectedShow } = this.state;

        const styles = {
            root: {
                backgroundColor: grey50,
                overflow: 'hidden',
                textAlign: 'center',
            },
        };

        return (
            <div style={styles.root}>
                <CastList
                    show={selectedShow}
                />
            </div>
        );
    };

    render() {
        return (
            <div>
                {this.header()}
                {this.search()}
                {this.content()}
            </div>
        );
    };

}

export default SearchCastByDate;