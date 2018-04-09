import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import AddPersonForm from '../people/AddPersonForm'

import { addPerson, moduleName } from '../../ducks/people';

class People extends Component {
  render() {
    return (
      <div>
        <h1>People</h1>
        <AddPersonForm onSubmit={this.props.addPerson} />
      </div>
    );
  }
}

export default connect(null, { addPerson })(People);