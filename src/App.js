import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthorizationPage } from 'pages/Authorization';
import { NotFoundPage } from 'pages/NotFound';

export default function App() {
  return (
    <Switch>
      <Route exact path="/auth" component={AuthorizationPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}
