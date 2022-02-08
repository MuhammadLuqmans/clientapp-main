import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import Accounts from '../pages/Accounts/Accounts';
import Home from '../pages/Home';
import Login from '../pages/Login/Login';
import Logout from '../pages/Logout/logout';
// import TraderPortal from '../pages/TraderPortal';
import Overview from '../pages/Trades/Overview';

import PrivateRoute from './private-route.component';

const Routes = () => {
  return (
    <Switch>
      <PrivateRoute path="/" exact component={Accounts} />
      <PrivateRoute path='/accounts/:accountName/trader-portal/:tradeId?' exact component={Home} /> {/* replace with TraderPortal */}
      <PrivateRoute path='/accounts/:accountName/trades' exact component={Overview} />
      <Route path="/login" component={Login} />
      <Route path="/logout" exact component={Logout} />
      <PrivateRoute path="/" exact component={() => <Redirect to="/accounts" />} />         
    </Switch>
  );
};

export default Routes;