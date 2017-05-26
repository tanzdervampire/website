// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { red500, grey50 } from 'material-ui/styles/colors';
import withWidth from 'material-ui/utils/withWidth';

import RaisedButton from 'material-ui/RaisedButton';

import ShowPickerDatePicker from './ShowPickerDatePicker';
import ShowPickerList from './ShowPickerList';

class ShowPicker extends React.Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };

    state = {
        open: false,
        numberOfShows: null,
        selectedDate: null,
    };

    componentDidMount() {
        fetch('/api/shows/stats', {
            accept: 'application/json',
        }).then((response) => {
            return response.json();
        }).then((stats) => {
            this.setState({ numberOfShows: stats['count'] });
        });
    };

    onGetStartedTapped = () => {
        this.setState({ open: true });
    };

    onDateSelected = (_, date) => {
        this.setState({ selectedDate: date });
        this.props.onChange(null);
    };

    render() {
        const { open, numberOfShows } = this.state;
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

        const styles = {
            root: {
                maxWidth: 400,
                margin: '0 auto',
            },
        };

        return (
            <div style={styles.root}>
                <ShowPickerDatePicker
                    onDateSelected={this.onDateSelected}
                />

                { this.state.selectedDate && (
                    <ShowPickerList
                        date={this.state.selectedDate}
                        onChange={this.props.onChange}
                    />
                ) }
            </div>
        );
    };

}

export default withWidth()(ShowPicker);