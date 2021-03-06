import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from 'helpers/Route';
import AuthorizationPage from 'pages/Authorization';
import { DashboardPage } from 'pages/Dashboard';
import UserSettingsPage from 'pages/UserSettings';
import ListPage from 'pages/List';
import MembersPage from 'pages/Members';
import NewElementPage from 'pages/NewElement';
import EditItemPage from 'pages/EditItem';

export default function App() {
  return (
    <Switch>
      <Route exact path="/auth" component={AuthorizationPage} noLayout />
      <Route exact path="/" component={DashboardPage} authProtected />
      <Route exact path="/user-settings" component={UserSettingsPage} authProtected />
      <Route exact path="/lists/:id" component={ListPage} authProtected />
      <Route exact path="/lists/:id/members" component={MembersPage} authProtected />
      <Route exact path="/lists/:id/new-element" component={NewElementPage} authProtected />
      <Route exact path="/lists/:id/item/:itemId" component={EditItemPage} authProtected />
      <Redirect to="/auth" />
    </Switch>
  )
}
