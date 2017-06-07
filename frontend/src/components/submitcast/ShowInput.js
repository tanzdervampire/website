// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { red500 } from 'material-ui/styles/colors';

import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Done from 'material-ui/svg-icons/action/done';

import ShowPickerDatePicker from '../showpicker/ShowPickerDatePicker';
import ShowTimePicker from '../submitcast/ShowTimePicker';

const Step = {
    DATE: 1,
    TIME: 2,
    LOCATION: 3,
};

function getStyles() {
    return {
        cardText: {
            textAlign: 'center',
        },
        dropdown: {
            width: '100%',
        },
    };
}

class ShowInput extends React.Component {

    static propTypes = {
        onFinish: PropTypes.func.isRequired,
        cardStyle: PropTypes.object,
    };

    static defaultProps = {
        cardStyle: {},
    };

    state = {
        selectedDate: null,
        selectedTime: null,
        selectedLocation: null,
        step: Step.DATE,
        productions: [],
        filteredProductions: [],
        fetchFailed: false,
    };

    componentDidMount() {
        this.loadProductions();
    };

    loadProductions() {
        fetch(`/api/productions`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(productions => {
            this.setState({ productions });
        }).catch(err => {
            console.log(`Failed to load productions!`);
            this.setState({ fetchFailed: true });
        });
    };

    handleOnDateSelected = date => {
        const { productions, step } = this.state;

        const mDate = moment(date);
        const filteredProductions = productions.filter(production => {
            const start = moment(production.start, 'YYYY-MM-DD');
            const end = moment(production.end, 'YYYY-MM-DD');
            return mDate.isBetween(start, end, 'day', '[]');
        });

        this.setState({
            filteredProductions,
            selectedDate: date,
            selectedLocation: filteredProductions[0],
            step: Math.max(step, Step.TIME),
        });
    };

    handleOnTimeSelected = time => {
        const { step } = this.state;
        this.setState({
            selectedTime: time,
            step: Math.max(step, Step.LOCATION),
        });
    };

    renderDatePicker() {
        const { selectedDate } = this.state;
        return (
            <ShowPickerDatePicker
                selectedDate={selectedDate}
                onDateSelected={this.handleOnDateSelected}
            />
        );
    };

    renderTimePicker() {
        const { selectedTime, step } = this.state;
        if (step < Step.TIME) {
            return null;
        }

        return (
            <ShowTimePicker
                selectedTime={selectedTime}
                onTimeSelected={this.handleOnTimeSelected}
                openDialog={!selectedTime}
            />
        );
    };

    renderLocationPicker() {
        const { selectedLocation, filteredProductions, step } = this.state;
        if (step < Step.LOCATION) {
            return null;
        }

        if (filteredProductions.length === 0) {
            return (
                <p>An diesem Datum wurde das Musical nicht aufgeführt.</p>
            );
        }

        const items = filteredProductions.map(production => {
            const label = `${production.location}, ${production.theater}`;
            return (
                <MenuItem
                    key={production.location}
                    value={production}
                    primaryText={label}
                />
            );
        });

        const styles = getStyles();
        return (
            <DropDownMenu
                value={selectedLocation}
                onChange={(_, index, value) => this.setState({ selectedLocation: value })}
                disabled={filteredProductions.length <= 1}
                autoWidth={false}
                style={styles.dropdown}
            >
                {items}
            </DropDownMenu>
        );
    };

    renderActions() {
        const { selectedDate, selectedTime, selectedLocation } = this.state;
        return (
            <FlatButton
                label="Weiter"
                onTouchTap={() => this.props.onFinish(selectedDate, selectedTime, selectedLocation)}
                primary={true}
                icon={<Done />}
                disabled={!(selectedDate && selectedTime && selectedLocation)}
            />
        );
    };

    render() {
        const { productions, fetchFailed } = this.state;
        const { cardStyle } = this.props;
        const styles = getStyles();

        return (
            <Card style={cardStyle}>
                <CardHeader
                    title="Vorstellung"
                    subtitle="Wann fand die Vorstellung statt?"
                    expandable={false}
                />

                <CardText style={styles.cardText}>
                    { fetchFailed && (
                        <p>Ups! Leider gab es ein Problem.</p>
                    ) }
                    { !fetchFailed && productions.length === 0 && (
                        <CircularProgress color={red500} />
                    ) }
                    { productions.length !== 0 && (
                        <div>
                            {this.renderDatePicker()}
                            {this.renderTimePicker()}
                            {this.renderLocationPicker()}
                        </div>
                    ) }
                </CardText>

                <CardActions>
                    {this.renderActions()}
                </CardActions>
            </Card>
        );
    };

}

export default ShowInput;