// @flow

import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import areIntlLocalesSupported from 'intl-locales-supported';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';

import DatePicker from 'material-ui/DatePicker';

import './ShowPickerDatePicker.css';

class ShowPickerDatePicker extends React.Component {

    static propTypes = {
        onDateSelected: PropTypes.func.isRequired,
    };

    state = {
        productions: null,
        minDate: null,
        maxDate: null,
    };

    constructor() {
        super();

        if (areIntlLocalesSupported(['de'])) {
            this.dateTimeFormat = global.Intl.DateTimeFormat;
        } else {
            const IntlPolyfill = require('intl');
            this.dateTimeFormat = IntlPolyfill.DateTimeFormat;
            require('intl/locale-data/jsonp/de');
        }
    };

    componentDidMount() {
        fetch('/api/productions', {
            accept: 'application/json',
        }).then((response) => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then((productions) => {
            const minDate = moment(productions.sort((a, b) => {
                const startA = moment(a['start'], 'YYYY-MM-DD');
                const startB = moment(b['start'], 'YYYY-MM-DD');
                return startB.isAfter(startA) ? -1 : +1;
            })[0]['start'], 'YYYY-MM-DD');

            const maxDate = moment(productions.sort((a, b) => {
                const startA = moment(a['end'], 'YYYY-MM-DD');
                const startB = moment(b['end'], 'YYYY-MM-DD');
                return startB.isAfter(startA) ? +1 : -1;
            })[0]['end'], 'YYYY-MM-DD');

            this.setState({
                productions: productions,
                minDate: minDate,
                maxDate: maxDate,
            });
        }).catch((err) => {
            console.log(`Failed to get information about available productions, error message: ${err.message}`);
            this.setState({
                productions: null,
                minDate: null,
                maxDate: null,
            });
        });
    };

    formatDate = (date) => {
        return moment(date).locale('de').format('dddd, DD.MM.YYYY');
    };

    shouldDisableDate = (date) => {
        const { productions, minDate, maxDate } = this.state;
        const currentDate = moment(date);

        if (currentDate.isBefore(minDate) || currentDate.isAfter(maxDate)) {
            return true;
        }

        if (!productions) {
            return false;
        }

        return productions.every((production) => {
            const startDate = moment(production['start'], 'YYYY-MM-DD');
            const endDate = moment(production['end'], 'YYYY-MM-DD');
            return !currentDate.isBefore(startDate) && !currentDate.isAfter(endDate);
        });
    };

    render() {
        return (
            <div id="show-picker-date-picker">
                <DatePicker
                    mode={this.props.width === LARGE ? "landscape" : "portrait"}
                    okLabel="OK"
                    cancelLabel="Abbrechen"
                    hintText="Wähle das Datum der Vorstellung"
                    autoOk={true}
                    formatDate={this.formatDate}
                    DateTimeFormat={this.dateTimeFormat}
                    locale="de-DE"
                    minDate={this.state.minDate && this.state.minDate.toDate()}
                    maxDate={this.state.maxDate && this.state.maxDate.toDate()}
                    onChange={this.props.onDateSelected}
                    shouldDisableDate={this.shouldDisableDate}
                />
            </div>
        );
    };
}

export default withWidth()(ShowPickerDatePicker);