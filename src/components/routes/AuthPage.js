import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import SignInForm from '../auth/SignInForm';
import SignUpForm from '../auth/SignUpForm';

import { signUp, signIn, moduleName } from '../../ducks/auth';

import Loader from '../common/Loader';

class AuthPage extends Component {
  render() {
    const { loading, error } = this.props;

    return (
      <Wrapper>
        <MainHeader>Auth page</MainHeader>
        <Links>
          <SCNavLink to="/auth/signin">Sign in</SCNavLink>
          <SCNavLink to="/auth/signup">Sign up</SCNavLink>
        </Links>
        <Switch>
          <Route
            path="/auth/signin"
            render={() => <SignInForm error={error} onSubmit={this.handleSignIn} />}
          />
          <Route
            path="/auth/signup"
            render={() => <SignUpForm error={error} onSubmit={this.handleSignUp} />}
          />
        </Switch>
        {loading && <Loader />}
      </Wrapper>
    );
  }

  handleSignIn = ({ email, password }) => this.props.signIn(email, password);

  handleSignUp = ({ email, password }) => {
    const { signUp } = this.props;

    return signUp(email, password);
  };
}

export default connect(
  state => ({
    loading: state[moduleName].loading,
    error: state[moduleName].error,
  }),
  { signUp, signIn },
)(AuthPage);

const Wrapper = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
`;

const Links = styled.div`
  display: flex;
  margin: auto;
`;

const SCNavLink = styled(NavLink)`
  display: flex;
  width: 100px;
  min-height: 40px;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  background-color: #dbc3c3;
  margin-right: 10px;
  &:hover {
    background-color: #edd8d0;
  }
  &:active {
    color: white;
  }
  &.active {
    background-color: #efe4d2;
  }
`;

const MainHeader = styled.h1`
  text-align: center;
`;
