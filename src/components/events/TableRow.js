import React from 'react';
import { defaultTableRowRenderer } from 'react-virtualized';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

class TableRow extends React.Component {
  componentDidMount() {
    this.props.connectPreview(getEmptyImage());
  }

  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(defaultTableRowRenderer(this.props));
  }
}

const spec = {
  beginDrag: props => {
    return {
      uid: props.rowData.uid,
    };
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectPreview: connect.dragPreview(),
});

export default connect(null, {})(DragSource('event', spec, collect)(TableRow));
