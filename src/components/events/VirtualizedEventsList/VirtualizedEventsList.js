import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column, InfiniteLoader } from 'react-virtualized';
import styled from 'styled-components';

import TableRow from './TableRow';

import {
  moduleName,
  fetchLazy,
  selectEvent,
  eventListSelector,
  selectionSelector,
} from '../../../ducks/events';

import 'react-virtualized/styles.css';

export class EventList extends Component {
  componentDidMount() {
    this.props.fetchLazy();
  }

  render() {
    const { loaded, events } = this.props;

    return (
      <Wrapper>
        <Header>Select events to add people</Header>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          rowCount={loaded ? events.length : events.length + 1}
          loadMoreRows={this.loadMoreRows}
        >
          {({ onRowsRendered, registerChild }) => (
            <Table
              ref={registerChild}
              rowCount={events.length}
              rowGetter={this.rowGetter}
              rowStyle={this.getRowStyle}
              rowHeight={40}
              headerHeight={50}
              overanRowCount={5}
              style={{ border: '1px solid black' }}
              width={600}
              height={300}
              onRowClick={this.handleRowClick}
              onRowsRendered={onRowsRendered}
              rowRenderer={this.getRowRenderer}
            >
              <Column style={{ fontWeight: 'bold' }} label="title" dataKey="title" width={300} />
              <Column label="where" dataKey="where" width={250} />
              <Column label="when" dataKey="month" width={150} />
            </Table>
          )}
        </InfiniteLoader>
      </Wrapper>
    );
  }

  getRowRenderer = props => <TableRow {...props} />;

  getRowStyle = ({ index }) => {
    const { events, selection } = this.props;

    return selection.includes(events[index] && events[index].uid)
      ? { backgroundColor: '#e5daed', border: '1px solid #e6e9ed' }
      : { border: '1px solid #e6e9ed' };
  };

  isRowLoaded = ({ index }) => index < this.props.events.length;

  loadMoreRows = () => {
    this.props.fetchLazy();
  };

  rowGetter = ({ index }) => this.props.events[index];

  handleRowClick = row => {
    const { selectEvent } = this.props;

    selectEvent && selectEvent(row.rowData.uid);
  };
}
export default connect(
  state => ({
    events: eventListSelector(state),
    selection: selectionSelector(state),
    loading: state[moduleName].loading,
  }),
  { fetchLazy, selectEvent },
)(EventList);

const Wrapper = styled.div`
  display: flex;
  margin-right: 40px;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.h2`
  text-align: center;
`;
