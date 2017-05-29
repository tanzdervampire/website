// @flow

import React from 'react';
import ShowPickerItem from './ShowPickerItem';

import { ListItem } from 'material-ui/List';

const shows = {
    'simple': {
        'id': 1,
        'day': '20.05.2017',
        'time': '14:30',
        'type': 'Matinée',
        'location': 'Stuttgart',
        'theater': 'Palladium',
    },
};

it('renders without crashing', () => {
    const wrapper = mountWithContext(<ShowPickerItem show={shows.simple} onShowSelected={() => {}}/>);
});

it('formats the type and time correctly', () => {
    const wrapper = mountWithContext(<ShowPickerItem show={shows.simple} onShowSelected={() => {}}/>);
    expect(wrapper).toIncludeText('Matinée, 14:30 Uhr');
});

it('formats the location and theater correctly', () => {
    const wrapper = mountWithContext(<ShowPickerItem show={shows.simple} onShowSelected={() => {}}/>);
    expect(wrapper).toIncludeText('Stuttgart, Palladium');
});

it('triggers the onShowSelected callback', () => {
    const cb = jest.fn();
    const wrapper = shallowWithContext(<ShowPickerItem show={shows.simple} onShowSelected={cb}/>);
    wrapper.find(ListItem).simulate('touchTap');

    const calls = cb.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(shows.simple);
});