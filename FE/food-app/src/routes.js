

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/app/Home';
import Page404 from './pages/Page404';
import UserRegister from './components/Layouts/HeaderComponent/UserRegister/UserRegister';
import BrandDetail from './pages/app/BrandDetail';

const Routes = () => (
  <Switch>
    {/* App Routes */}
    <Route path="/" exact component={Home} />
    <Route path="/register" component={UserRegister} />
    <Route path="/brand/:slug" component={BrandDetail}/>
    {/* Admin Routes */}
    {/* <Route path="/admin/dashboard" component={Dashboard} /> */}
    <Route component={Page404} />
  </Switch>
);

export default Routes;
