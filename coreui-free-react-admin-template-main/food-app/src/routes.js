

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/app/Home';
import LoginAdmin from './pages/admin/LoginAdmin';
import UserRegister from './components/Layouts/HeaderComponent/UserRegister/UserRegister';

const Routes = () => (
  <Switch>
    {/* App Routes */}
    <Route path="/" exact component={Home} />
    <Route path="/register" component={UserRegister} />


    {/* Admin Routes */}
    {/* <Route path="/admin/dashboard" component={Dashboard} /> */}
    <Route path="/admin" component={LoginAdmin} />
  </Switch>
);

export default Routes;
