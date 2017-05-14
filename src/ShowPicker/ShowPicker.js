// @flow

import React from 'react';
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

    state = {
        stepIndex: 0,
        date: new Date(),
        show: "soiree"
    };

    handleNext = () => {
        const {stepIndex, date, show} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
        });

        if (stepIndex >= 1 && this.props.onFinish) {
            this.props.onFinish(date, show);
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
        const {stepIndex} = this.state;

        const minDate = new Date("10-04-1997");
        const maxDate = new Date();

        const styles = {
            radioButtonGroup: {
                marginTop: 16,
                marginBottom: 16,
            },
            radioButton: {
                textAlign: "left",
                marginBottom: 16,
            },
        };

        return (
            <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Wähle das Datum der Vorstellung aus</StepLabel>
                        <StepContent>
                            <DatePicker
                                hintText="Datum wählen"
                                cancelLabel="Abbrechen"
                                autoOk="true"
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
                                defaultSelected="soiree"
                                style={styles.radioButtonGroup}
                                onChange={this.handleShowChange}
                            >
                                <RadioButton
                                    value="matinee"
                                    label="Matinee (Nachmittag)"
                                    style={styles.radioButton}
                                />
                                <RadioButton
                                    value="soiree"
                                    label="Soiree (Abend)"
                                    style={styles.radioButton}
                                />
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