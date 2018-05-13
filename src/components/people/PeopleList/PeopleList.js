import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';

import PersonCard from './PersonCard/PersonCard';

import { peopleListSelector, fetchAllPeople } from '../../../ducks/people';

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchAllPeople();
  }

  componentDidUpdate() {
    this.List.recomputeRowHeights();
  }

  render() {
    const style = {
      textAlign: 'center',
      border: '1px solid black',
      marginTop: '5px',
      justifyContent: 'center',
    };

    return (
      <List
        rowCount={this.props.people.length}
        rowHeight={150}
        height={400}
        style={style}
        width={300}
        rowRenderer={this.rowRenderer}
        ref={ref => (this.List = ref)}
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
