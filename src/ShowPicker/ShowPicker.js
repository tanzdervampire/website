// @flow

import React from 'react';
import PropTypes from 'prop-types';

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

    static propTypes = {
        /**
         * Callback to determine which shows are available with signature (date) => [].
         * The returned array must contain objects with the signature
         * {
         *   "id": <id>,
         *   "name": <name>,
         * }
         */
        onDateSelected: PropTypes.func.isRequired,

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
        date: new Date(),

        /** The shows which are possible after having selected a date. */
        shows: [],

        /** The ID of the selected show. */
        show: undefined,
    };

    handleNext = () => {
        const {stepIndex, date, show} = this.state;

        this.setState({
            stepIndex: stepIndex + 1,
        });

        if (stepIndex === 0) {
            this.setState({
                shows: this.props.onDateSelected(date),
            });
        }

        if (stepIndex === 1) {
            this.props.onFinish(show);

            // TODO Refactor to avoid duplicating the defaults.
            this.setState({
                stepIndex: 0,
                date: new Date(),
                shows: [],
                show: undefined,
            });
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    handleDateChange = (_, date) => {
        this.setState({
            date: date
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

    render() {
        const {stepIndex, shows} = this.state;

        const minDate = new Date("10-04-1997");
        const maxDate = new Date();

        const styles = {
            radioButton: {
                textAlign: "left",
                marginBottom: 16,
            },
        };

        var items = shows.map((current) => {
            return (
                <RadioButton
                    value={current.id}
                    label={current.name}
                    style={styles.radioButton}
                />
            );
        });

        return (
            <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Wähle das Datum der Vorstellung aus</StepLabel>
                        <StepContent>
                            <DatePicker
                                hintText="Datum wählen"
                                cancelLabel="Abbrechen"
                                autoOk={true}
                                defaultDate={this.state.date}
                                DateTimeFormat={global.Intl.DateTimeFormat}
                                locale="de-DE"
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={this.handleDateChange}
                            />

                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Wähle zwischen Matinee und Soiree</StepLabel>
                        <StepContent>
                            <RadioButtonGroup
                                name="show"
                                onChange={this.handleShowChange}
                            >
                                {items}
                            </RadioButtonGroup>

                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
    }

}

export default ShowPicker;