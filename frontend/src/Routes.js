// @flow

import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import SearchCastByDate from './components/pages/SearchCastByDate';
import EnterCast from './components/pages/EnterCast';
import Error404 from './components/pages/Error404';

// TODO FIXME Can these be nested better?
// TODO FIXME Split the search page from display a list? nesting?
const Routes = () => (
    <Switch>
        <Route exact path="/" component={SearchCastByDate} />
        <Route exact path="/shows/:location/:day/:month/:year/:time" component={SearchCastByDate} />
        <Route exact path="/shows/new" component={EnterCast} />
        <Route path="/shows" component={SearchCastByDate} />

        <Route component={Error404} />
    </Switch>
);

export default Routes;