// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class ShowPicker extends React.Component {

    constructor() {
        super();

        this.loadAvailableDates();
    }

    static propTypes = {
        /**
         * Called when a show has been selected, called with the ID of the selected show.
         * Signature: (id) => ().
         */
        onFinish: PropTypes.func.isRequired,
    };

    state = {
        /** The current step of the stepper. */
        stepIndex: 0,

        /** The selected date. */
        date: null,

        /** The shows which are possible after having selected a date. */
        shows: [],

        /** The ID of the selected show. */
        show: null,

        /* Whether available shows have been loaded already. */
        hasLoaded: false,

        /* List of dates which are allowed */
        availableDates: [],
    };

    loadAvailableDates() {
        fetch("api/dates", {
            accept: "application/json"
        }).then((response) => {
            return response.json();
        }).then((dates) => {
            this.setState({
                availableDates: dates
            });

            if (!this.state.date) {
                this.setState({
                    date: moment(dates[dates.length - 1], "DD.MM.YYYY").toDate(),
                });
            }
        });
    };

    disableUnavailableDates = (date) => {
        const { availableDates } = this.state;
        if(availableDates.length === 0) {
            return false;
        }

        var formattedDate = moment(date).format("DD.MM.YYYY");
        return !availableDates.includes(formattedDate);
    };

    handleNext = () => {
        const {stepIndex, date, show} = this.state;

        this.setState({
            stepIndex: stepIndex + 1,
        });

        if (stepIndex === 0) {
            var formattedDate = moment(date).format("DD.MM.YYYY");

            fetch("api/shows?date=" + formattedDate, {
                accept: "application/json"
            }).then((response) => {
                return response.json();
            }).then((shows) => {
                var selected = (shows.length > 0) ? shows[0].id : "";

                this.setState({
                    shows: shows,
                    show: selected,
                    hasLoaded: true,
                });
            });

            // TODO Skip next step if there is only one show.
        }

        if (stepIndex === 1) {
            this.props.onFinish(show);

            this.setState({
                stepIndex: 0,
                shows: [],
                show: null,
                hasLoaded: false,
            });
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({
                stepIndex: stepIndex - 1,
                hasLoaded: false,
            });
        }
    };

    handleDateChange = (_, date) => {
        this.setState({
            date: date,
            hasLoaded: false,
        });
    };

    handleShowChange = (_, value) => {
        this.setState({
            show: value
        });
    };

    renderStepActions(step) {
        const {stepIndex} = this.state;

        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={stepIndex === 1 ? 'Besetzung suchen' : 'Weiter'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onTouchTap={this.handleNext}
                    style={{marginRight: 12}}
                />
                {step > 0 && (
                    <FlatButton
                        label="Zurück"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onTouchTap={this.handlePrev}
                    />
                )}
            </div>
        );
    }

    showStepContent() {
        const { shows, show, hasLoaded } = this.state;

        const styles = {
            radioButton: {
                textAlign: "left",
                marginBottom: 16,
            },
        };

        if (!hasLoaded) {
            return (
                <p>Bitte warten…</p>
            );
        }

        if (shows.length === 0) {
            return (
                <p>Für diesen Tag haben wir leider keine Besetzungsliste!</p>
            );
        }

        var items = shows.map((current) => {
            // TODO include time AND place in label
            return (
                <RadioButton
                    key={current.id}
                    value={current.id}
                    label={current.time}
                    style={styles.radioButton}
                />
            );
        });

        return (
            <RadioButtonGroup
                name="show"
                onChange={this.handleShowChange}
                valueSelected={show}
            >
                {items}
            </RadioButtonGroup>
        );
    }

    render() {
        const {stepIndex, date, availableDates} = this.state;

        let minDate, maxDate;
        if (availableDates.length === 0) {
            minDate = new Date("10-04-1997");
            maxDate = new Date();
        } else {
            minDate = moment(availableDates[0], "DD.MM.YYYY").toDate();
            maxDate = moment(availableDates[availableDates.length - 1], "DD.MM.YYYY").toDate();
        }

        let DateTimeFormat = global.Intl.DateTimeFormat;

        return (
            <div style={{maxHeight: 400, margin: "0 auto"}}>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Wähle das Datum der Vorstellung aus</StepLabel>
                        <StepContent>
                            <DatePicker
                                hintText="Datum wählen"
                                cancelLabel="Abbrechen"
                                autoOk={true}
                                value={date}
                                DateTimeFormat={DateTimeFormat}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={this.handleDateChange}
                                formatDate={new DateTimeFormat("de-DE", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format}
                                shouldDisableDate={this.disableUnavailableDates}
                            />

                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Wähle die Vorstellung</StepLabel>
                        <StepContent>
                            <div>
                                {this.showStepContent()}
                                {this.renderStepActions(1)}
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
    }

}

export default ShowPicker;