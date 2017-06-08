// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SearchCastByDate from './components/pages/SearchCastByDate';
import ListOfShows from './components/pages/ListOfShows';
import SubmitCast from './components/pages/SubmitCast';
import Error404 from './components/pages/Error404';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={SearchCastByDate} />
        <Route exact path="/shows/:location/:day/:month/:year/:time" component={SearchCastByDate} />
        <Route exact path="/shows/new" component={SubmitCast} />
        <Route exact path="/shows" component={ListOfShows} />

        <Route component={Error404} />
    </Switch>
);

export default Routes;