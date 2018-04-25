import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddPersonForm from '../people/AddPersonForm';

import { addPerson } from '../../ducks/people';

class People extends Component {
  render() {
    return (
      <div>
        <h1>People</h1>
        <AddPersonForm onSubmit={this.submitPerson} />
      </div>
    );
  }
  // onSubmit: (values) => {
  //   return new Promise((resolve, reject) => {
  //     dispatch(someActionCreator({ values, resolve, reject }))
  //   });
  // }

  submitPerson = values => {
    const { addPerson } = this.props;

    return new Promise((resolve, reject) => {
      addPerson({ values, resolve, reject });
    });
  };
}

export default connect(null, { addPerson })(People);
