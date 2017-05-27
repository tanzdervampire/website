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
        shows: PropTypes.array,
        selectedDate: PropTypes.instanceOf(Date),
        selectedShow: PropTypes.object,
        onDateSelected: PropTypes.func,
    };

    state = {
        open: false,
        numberOfShows: null,
        requestOpenDialog: false,
    };

    componentDidMount() {
        /* Skip the button if we get here from a URL. */
        // TODO FIXME Use a dedicated prop instead of guessing it from the presence of the year parameter.
        if (this.props.match.params.year) {
            this.setState({ open: true });
        }

        fetch('/api/shows/stats', {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(stats => {
            this.setState({ numberOfShows: stats['count'] });
        }).catch(err => {
            console.log(`Failed to get current show statistics, error message: ${err.message}`);
        });
    };

    onGetStartedTapped = () => {
        this.setState({
            open: true,
            requestOpenDialog: true
        });
    };

    renderGetStartedComponent() {
        const { numberOfShows } = this.state;
        /* Make the number look a bit nicer. Nobody cares about total precision. */
        const displayedNumberOfShows = numberOfShows ? 100 * Math.floor(numberOfShows / 100) : 2000;

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
    };

    renderMainComponent() {
        const styles = {
            root: {
                maxWidth: 400,
                margin: '0 auto',
            },
        };

        return (
            <div style={styles.root}>
                <ShowPickerDatePicker
                    selectedDate={this.props.selectedDate}
                    onDateSelected={(_, date) => this.props.onDateSelected(date)}
                    openDialog={this.state.requestOpenDialog}
                />

                { this.props.selectedDate && (
                    <ShowPickerList
                        history={this.props.history}
                        selectedDate={this.props.selectedDate}
                        shows={this.props.shows}
                        selectedShow={this.props.selectedShow}
                    />
                ) }
            </div>
        );
    };

    render() {
        const { open } = this.state;

        return (
            <div>
                {!open && this.renderGetStartedComponent()}
                {open && this.renderMainComponent()}
            </div>
        );
    };

}

export default withWidth()(ShowPicker);