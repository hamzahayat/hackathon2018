import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SplashScreen from '../SplashScreen';
import Home from '../Home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={SplashScreen} />
      <Route path="/home" exact component={Home} />
    </Switch>
  </BrowserRouter>
);
