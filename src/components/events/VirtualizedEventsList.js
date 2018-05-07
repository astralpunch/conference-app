import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column, InfiniteLoader } from 'react-virtualized';

import {
  moduleName,
  fetchLazy,
  selectEvent,
  eventListSelector,
  selectionSelector,
} from '../../ducks/events';

import 'react-virtualized/styles.css';

export class EventList extends Component {
  componentDidMount() {
    this.props.fetchLazy();
  }

  render() {
    const { loaded, events } = this.props;

    return (
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
            overscanRowCount={5}
            width={700}
            height={300}
            onRowClick={this.handleRowClick}
            onRowsRendered={onRowsRendered}
          >
            <Column label="title" dataKey="title" width={300} />
            <Column label="where" dataKey="where" width={250} />
            <Column label="when" dataKey="month" width={150} />
          </Table>
        )}
      </InfiniteLoader>
    );
  }

  getRowStyle = ({ index }) => {
    const { events, selection } = this.props;

    return selection.includes(events[index] && events[index].uid)
      ? { backgroundColor: '#c6bce5' }
      : null;
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
