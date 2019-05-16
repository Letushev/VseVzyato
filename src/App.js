import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from 'helpers/Route';
import AuthorizationPage from 'pages/Authorization';
import { DashboardPage } from 'pages/Dashboard';
import UserSettingsPage from 'pages/UserSettings';

export default function App() {
  return (
    <Switch>
      <Route exact path="/auth" component={AuthorizationPage} noLayout />
      <Route exact path="/" component={DashboardPage} authProtected />
      <Route exact path="/user-settings" component={UserSettingsPage} authProtected />
      <Redirect to="/auth" />
    </Switch>
  )
}
