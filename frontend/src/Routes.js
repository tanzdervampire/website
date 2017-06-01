// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SearchCastByDate from './components/pages/SearchCastByDate';
import SubmitCast from './components/pages/SubmitCast';
import Error404 from './components/pages/Error404';

// TODO FIXME Can these be nested better?
const Routes = () => (
    <Switch>
        <Route exact path="/" component={SearchCastByDate} />
        <Route exact path="/shows/:location/:day/:month/:year/:time" component={SearchCastByDate} />
        <Route exact path="/shows/new" component={SubmitCast} />
        <Route path="/shows" component={SearchCastByDate} />

        <Route component={Error404} />
    </Switch>
);

export default Routes;