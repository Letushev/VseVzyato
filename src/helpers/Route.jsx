import React from 'react';
import { Redirect, Route as ReactRoute } from 'react-router-dom';
import Header from 'layout/Header';

export function Route({ authProtected, noLayout, component: Component, ...routeProps }) {
  if (authProtected) {
    const isLoggedIn = !!localStorage.getItem('authToken');
    if (!isLoggedIn) {
      return <Redirect to="/auth" />;
    }
  }

  return (
    <ReactRoute
      {...routeProps}
      render={props => {
        if (noLayout) {
          return <Component {...props} />;
        }

        return (
          <>
            <Header />
            <Component {...props} />
          </>
        );
      }}
    />
  );
}
