// @flow

import React from 'react';
import moment from 'moment';
import ShowPickerList from './ShowPickerList';

import CircularProgress from 'material-ui/CircularProgress';

const shows = [
    {
        'id': 1,
        'day': '20.05.2017',
        'time': '14:30',
        'type': 'Matinée',
        'location': 'Stuttgart',
        'theater': 'Palladium',
    },
];

it('renders without crashing', () => {
    const wrapper = mountWithContext(
        <ShowPickerList
            shows={shows}
            selectedShow={shows[0]}
            selectedDate={moment(shows[0].day, 'DD.MM.YYYY').toDate()}
        />
    );
});

it('renders a throbber if no shows are given', () => {
    const wrapper = mountWithContext(
        <ShowPickerList
            shows={null}
            selectedShow={null}
            selectedDate={moment(shows[0].day, 'DD.MM.YYYY').toDate()}
        />
    );

    expect(wrapper.find(CircularProgress)).not.toBeEmpty();
});

it('displays a message if there are no shows for this day', () => {
    const wrapper = mountWithContext(
        <ShowPickerList
            shows={[]}
            selectedShow={null}
            selectedDate={moment(shows[0].day, 'DD.MM.YYYY').toDate()}
        />
    );

    expect(wrapper).toIncludeText('Für diesen Tag gibt es aktuell leider keine Informationen');
});