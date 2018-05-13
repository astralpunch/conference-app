import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ProtectedRoute from './common/ProtectedRoute';

import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import People from './routes/People';
import CustomDragLayer from './common/CustomDragLayer';

import { moduleName, signOut } from '../ducks/auth';

class Root extends Component {
  render() {
    const { signOut, signedIn } = this.props;

    const btn = signedIn && <SignOutBtn onClick={signOut}>Sign out</SignOutBtn>;

    return (
      <Container>
        <FlexWrapper>
          {signedIn && (
            <Nav>
              <SCNavLink to="/people">People</SCNavLink>
              <SCNavLink to="/admin">Admin page</SCNavLink>
            </Nav>
          )}
          <UserBlock>{btn}</UserBlock>
        </FlexWrapper>
        <Switch>
          <ProtectedRoute exact path="/" component={AdminPage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
          <ProtectedRoute path="/people" component={People} />
          <Route path="/auth" component={AuthPage} />
        </Switch>
        <CustomDragLayer />
      </Container>
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

const SignOutBtn = styled.button`
  font-size: 20px;
  width: 100px;
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  outline: none;
  min-height: 40px;
  color: #5b7bad;
  &:hover {
    font-weight: 600;
  }
  &:active {
    font-weight: 700;
  }
`;

const UserBlock = styled.div`
  margin-right: 10px;
`;

const Nav = styled.nav`
  position: absolute;
  right: 45%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SCNavLink = styled(NavLink)`
  margin-right: 5px;
  color: #000;
    &:hover {
      color: black;
    }
    &.active{
      color: paleturquoise;
  }
  }
`;
