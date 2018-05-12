import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import emailValidator from 'email-validator';
import styled from 'styled-components';

import ErrorField from '../common/ErrorField';

class SignUpForm extends Component {
  render() {
    const { handleSubmit, submitFailed, error } = this.props;

    return (
      <div>
        <Header>Sign Up</Header>
        <form onSubmit={handleSubmit}>
          <Field placeholder="Email" name="email" component={ErrorField} />
          <Field placeholder="Password" name="password" component={ErrorField} type="password" />
          <SubmitBtn type="submit">Submit</SubmitBtn>
          {submitFailed && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      </div>
    );
  }
}

const validate = ({ email, password }) => {
  const errors = {};

  if (!email) errors.email = 'email is required';
  else if (!emailValidator.validate(email)) errors.email = 'invalid email';

  if (!password) errors.password = 'password is required';
  else if (password.length < 8) errors.password = 'to short';

  return errors;
};

export default reduxForm({
  form: 'auth',
  validate,
})(SignUpForm);

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
