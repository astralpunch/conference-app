import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import emailValidator from 'email-validator';
import styled from 'styled-components';

import ErrorField from '../common/ErrorField';

class AddPersonForm extends Component {
  render() {
    const { handleSubmit, submitFailed, error } = this.props;

    return (
      <Wrapper>
        <form onSubmit={handleSubmit}>
          <Field placeholder="Email" name="email" component={ErrorField} />
          <Field placeholder="First Name" name="firstName" component={ErrorField} />
          <Field placeholder="Last Name" name="lastName" component={ErrorField} />
          <Submit type="submit">Submit</Submit>
          {submitFailed && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      </Wrapper>
    );
  }
}

const validate = ({ email, firstName, lastName }) => {
  const errors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailValidator.validate(email)) errors.email = 'Invalid email';

  if (!firstName) errors.firstName = 'First name is required';
  if (!lastName) errors.lastName = 'Last name is required';

  return errors;
};

export default reduxForm({
  form: 'people',
  validate,
})(AddPersonForm);

const Submit = styled.button`
  display: block;
  font-size: 20px;
  width: 355px;
  height: 35px;
  background-color: paleturquoise;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
`;
