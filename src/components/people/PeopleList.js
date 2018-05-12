import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import styled from 'styled-components';

import PersonCard from './PersonCard';

import { peopleListSelector, fetchAllPeople } from '../../ducks/people';

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchAllPeople();
  }

  render() {
    return (
      <SCList
        rowCount={this.props.people.length}
        rowHeight={150}
        height={400}
        width={300}
        rowRenderer={this.rowRenderer}
      />
    );
  }

  rowRenderer = ({ index, key, style }) => (
    <PersonCard person={this.props.people[index]} key={key} virtualizedStyle={style} />
  );
}

export default connect(
  state => ({
    people: peopleListSelector(state),
  }),
  { fetchAllPeople },
)(PeopleList);

const SCList = styled(List)`
  border: 1px solid black;
  margin: 5px;
  text-align: center;
`;
