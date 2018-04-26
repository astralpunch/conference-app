import React, { Component } from 'react';
import { connect } from 'react-redux';
import { moduleName, fetchAll, peopleListSelector } from '../../ducks/people';
import { Table, Column } from 'react-virtualized';

import 'react-virtualized/styles.css';

export class VirtualizedPeopleList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    const { people } = this.props;

    return (
      <Table
        rowGetter={this.rowGetter}
        rowHeight={40}
        rowCount={people.length}
        headerHeight={50}
        overscanRowCount={5}
        width={700}
        height={300}
        onRowClick={this.handleRowClick}
      >
        <Column label="firstName" dataKey="firstName" width={150} />
        <Column label="lastName" dataKey="lastName" width={150} />
        <Column label="email" dataKey="email" width={300} />
      </Table>
    );
  }

  rowGetter = ({ index }) => this.props.people[index];

  handleRowClick = rowData => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(rowData.uid);
  };
}

export default connect(
  state => ({
    people: peopleListSelector(state),
    loading: state[moduleName].loading,
  }),
  { fetchAll },
)(VirtualizedPeopleList);
