import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import ProtectedRoute from './common/ProtectedRoute';

import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import People from './routes/People';
import Events from './routes/Events';

import { moduleName, signOut } from '../ducks/auth';

class Root extends Component {
  render() {
    const { signOut, signedIn } = this.props;
    const btn = signedIn ? (
      <button onClick={signOut}>sign out</button>
    ) : (
      <Link to="/auth/signin">sign in</Link>
    );
    return (
      <div>
        {btn}
        <Link to="/people">People</Link>
        <Link to="/events">Events</Link>
        <Link to="/admin">Admin page</Link>
        <Switch>
          <ProtectedRoute path="/admin" component={AdminPage} />
          <ProtectedRoute path="/people" component={People} />
          <ProtectedRoute path="/events" component={Events} />
          <Route path="/auth" component={AuthPage} />
        </Switch>
      </div>
    );
  }
}

export default connect(
  state => ({
    signedIn: !!state[moduleName].user,
  }),
  { signOut },
  null,
  { pure: false },
)(Root);
