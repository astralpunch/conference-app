import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import AddPersonForm from '../people/AddPersonForm';

import { addPerson, moduleName } from '../../ducks/people';
import VirtualizedPeopleList from '../people/VirtualizedPeopleList/VirtualizedPeopleList';

class People extends Component {
  render() {
    return (
      <Wrapper>
        <MainHeader>Add new person</MainHeader>
        <AddPersonForm onSubmit={this.submitPerson} />
        <VirtualizedPeopleList />
      </Wrapper>
    );
  }

  submitPerson = values => {
    const { addPerson } = this.props;

    return new Promise((resolve, reject) => {
      addPerson({ values, resolve, reject });
    });
  };
}

export default connect(
  state => ({
    loading: state[moduleName].loading,
  }),
  { addPerson },
)(People);

const MainHeader = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const Wrapper = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
`;
