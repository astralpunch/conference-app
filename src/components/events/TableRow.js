import React, { Component } from 'react';
import { defaultTableRowRenderer } from 'react-virtualized';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';

class TableRow extends Component {
  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(defaultTableRowRenderer(this.props));
  }
}

const spec = {
  beginDrag: props => {
    return {
      eventUid: props.rowData.uid,
    };
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
});

export default connect(null, {})(DragSource('event', spec, collect)(TableRow));
