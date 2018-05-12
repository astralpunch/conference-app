import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import { TransitionMotion, spring } from 'react-motion';
import styled from 'styled-components';

import { moduleName, fetchAllPeople, peopleListSelector } from '../../ducks/people';

import 'react-virtualized/styles.css';

export class VirtualizedPeopleList extends Component {
  componentDidUpdate({ people }) {
    if (people.length && this.props.people.length > people.length) {
      setTimeout(() => {
        this.table.scrollToRow(this.props.people.length);
      }, 0);
    }
  }

  render() {
    return (
      <Wrapper>
        <TransitionMotion styles={this.getStyles()} willEnter={this.willEnter}>
          {interpolated => (
            <Table
              rowGetter={this.rowGetter}
              rowHeight={40}
              rowCount={interpolated.length}
              headerHeight={50}
              overscanRowCount={2}
              style={{ border: '1px solid black' }}
              rowStyle={({ index }) =>
                index < 0 ? {} : { border: '1px solid #e6e9ed', ...interpolated[index].style }
              }
              width={500}
              height={300}
              onRowClick={this.handleRowClick}
              ref={ref => (this.table = ref)}
              rowClassName="test--people-list__row"
            >
              <Column label="firstName" dataKey="firstName" width={150} />
              <Column label="lastName" dataKey="lastName" width={150} />
              <Column label="email" dataKey="email" width={300} />
            </Table>
          )}
        </TransitionMotion>
      </Wrapper>
    );
  }

  willEnter = () => ({
    opacity: 0,
  });

  getStyles() {
    return this.props.people.map(person => ({
      style: {
        opacity: spring(1, { stiffness: 30 }),
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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
