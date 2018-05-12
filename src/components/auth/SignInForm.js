import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import styled from 'styled-components';

import ErrorField from '../common/ErrorField';

class SignInForm extends Component {
  render() {
    const { handleSubmit, onSubmit } = this.props;

    return (
      <div>
        <Header>Sign In</Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Field name="email" placeholder="Email" component={ErrorField} />
          </div>
          <div>
            <Field name="password" placeholder="Password" component={ErrorField} type="password" />
          </div>
          <SubmitBtn type="submit">Submit</SubmitBtn>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'auth',
})(SignInForm);

const Header = styled.h2`
  text-align: center;
`;

const SubmitBtn = styled.button`
  display: block;
  font-size: 20px;
  width: 355px;
  height: 35px;
  background-color: paleturquoise;
`;
