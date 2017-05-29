// @flow

import { mount, shallow, render } from 'enzyme';
import 'jest-enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme();

global.mountWithContext = node => mount(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: PropTypes.object },
});

global.shallowWithContext = node => shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: PropTypes.object },
});

global.renderWithContext = node => render(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: PropTypes.object },
});