import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddPersonForm from '../people/AddPersonForm';

import { addPerson } from '../../ducks/people';
import VirtualizedPeopleList from '../people/VirtualizedPeopleList';

class People extends Component {
  render() {
    return (
      <div>
        <h1>People</h1>
        <AddPersonForm onSubmit={this.submitPerson} />
        <VirtualizedPeopleList />
      </div>
    );
  }

  submitPerson = values => {
    const { addPerson } = this.props;

    return new Promise((resolve, reject) => {
      addPerson({ values, resolve, reject });
    });
  };
}

export default connect(null, { addPerson })(People);
