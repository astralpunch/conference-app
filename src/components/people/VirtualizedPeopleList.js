import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import { TransitionMotion, spring } from 'react-motion';

import { moduleName, fetchAllPeople, peopleListSelector } from '../../ducks/people';

import 'react-virtualized/styles.css';

export class VirtualizedPeopleList extends Component {
  render() {
    return (
      <TransitionMotion styles={this.getStyles()} willEnter={this.willEnter}>
        {interpolated => (
          <Table
            rowGetter={this.rowGetter}
            rowHeight={40}
            rowCount={interpolated.length}
            headerHeight={50}
            overscanRowCount={2}
            rowStyle={({ index }) => (index < 0 ? {} : interpolated[index].style)}
            width={700}
            height={300}
            onRowClick={this.handleRowClick}
            rowClassName="test--people-list__row"
          >
            <Column label="firstName" dataKey="firstName" width={150} />
            <Column label="lastName" dataKey="lastName" width={150} />
            <Column label="email" dataKey="email" width={300} />
          </Table>
        )}
      </TransitionMotion>
    );
  }

  willEnter = () => ({
    opacity: 0,
  });

  getStyles() {
    return this.props.people.map(person => ({
      style: {
        opacity: spring(1, { stiffness: 70 }),
      },
      key: person.uid,
      data: person,
    }));
  }

  rowGetter = ({ index }) => this.props.people[index];
}

export default connect(
  state => ({
    people: peopleListSelector(state),
    loading: state[moduleName].loading,
  }),
  { fetchAllPeople },
)(VirtualizedPeopleList);
