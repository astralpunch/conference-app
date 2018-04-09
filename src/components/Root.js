import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from './common/ProtectedRoute';
import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import People from './routes/People';

class Root extends Component {
  render() {
    return (
      <div>
        <ProtectedRoute exact path="/" component={AdminPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/people" component={People} />
      </div>
    );
  }
}

export default Root;
