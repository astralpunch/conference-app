import React, { Component } from 'react';
// import { SubmissionError } from 'redux-form';
import SignInForm from '../auth/SignInForm';
import SignUpForm from '../auth/SignUpForm';
import { Route, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp, signIn, moduleName } from '../../ducks/auth';
import Loader from '../common/Loader';

class AuthPage extends Component {
  render() {
    const { loading, error } = this.props;
    return (
      <div>
        <h1>Auth page</h1>
        <NavLink to="/auth/signin" activeStyle={{ color: 'red' }}>
          sign in
        </NavLink>
        <NavLink to="/auth/signup" activeStyle={{ color: 'red' }}>
          sign up
        </NavLink>
        <Route
          path="/auth/signin"
          render={() => <SignInForm error={error} onSubmit={this.handleSignIn} />}
        />
        <Route
          path="/auth/signup"
          render={() => <SignUpForm error={error} onSubmit={this.handleSignUp} />}
        />
        {loading && <Loader />}
      </div>
    );
  }

  handleSignIn = ({ email, password }) => this.props.signIn(email, password);
  handleSignUp = ({ email, password }) => {
    const { signUp } = this.props;

    return signUp(email, password);
    // .then(
    //   res => res,
    //   error => {
    //     throw new SubmissionError({ _error: error.message });
    //   },
    // );
  };
}

export default connect(
  state => ({
    loading: state[moduleName].loading,
    error: state[moduleName].error,
  }),
  { signUp, signIn },
)(AuthPage);
