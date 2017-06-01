// @flow

import React from 'react';
import PropTypes from 'prop-types';

import TimePicker from 'material-ui/TimePicker';

import './ShowTimePicker.css';

class ShowTimePicker extends React.Component {

    static propTypes = {
        onTimeSelected: PropTypes.func.isRequired,
        selectedTime: PropTypes.instanceOf(Date),
        openDialog: PropTypes.bool,
    };

    componentDidMount() {
        if (this.props.openDialog) {
            try {
                this.timePickerRef.openDialog();
            } catch (e) {
                console.log('Failed to open the dialog.');
            }
        }
    };

    // TODO FIXME minutesStep={30} once released
    render() {
        return (
            <div id="show-time-picker">
                <TimePicker
                    name="showTimePicker"
                    autoOk={true}
                    cancelLabel="Abbrechen"
                    hintText="HH:MM"
                    format="24hr"
                    onChange={(_, time) => this.props.onTimeSelected(time)}
                    hintStyle={{ width: '100%', textAlign: 'center' }}
                    value={this.props.selectedTime}
                    ref={(element) => { this.timePickerRef = element; }}
                />
            </div>
        );
    };

}

export default ShowTimePicker;