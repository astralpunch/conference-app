import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import emailValidator from 'email-validator';
import ErrorField from '../common/ErrorField';

class AddPersonForm extends Component {
  render() {
    const { handleSubmit, submitFailed, error } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Field label='Email' name="email" component={ErrorField} />
          <Field label='First Name' name="firstName" component={ErrorField} />
          <Field label='Last Name' name="lastName" component={ErrorField} />
          <div>
            <input type="submit" />
          </div>
          {submitFailed && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      </div>
    );
  }
}

const validate = ({ email, firstName, lastName }) => {
  const errors = {};

  if (!email) errors.email = 'email is required';
  else if (!emailValidator.validate(email)) errors.email = 'invalid email';

  if (!firstName) errors.firstName = 'first name is required';
  if (!lastName) errors.lastName = 'last name is required';

  return errors;
};

export default reduxForm({
  form: 'people',
  validate,
})(AddPersonForm);
