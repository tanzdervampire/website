// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SearchCastByDate from './components/pages/SearchCastByDate';
import Error404 from './components/pages/Error404';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={SearchCastByDate} />
        <Route path="/show/:location/:day/:month/:year/:time" component={SearchCastByDate} />
        <Route component={Error404} />
    </Switch>
);

export default Routes;