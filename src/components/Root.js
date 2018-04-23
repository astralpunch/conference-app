import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProtectedRoute from './common/ProtectedRoute';
import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import People from './routes/People';

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
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/people" component={People} />
        <Route path="/auth" component={AuthPage} />
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
