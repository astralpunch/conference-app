import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';

import { removeEvent } from '../../ducks/events';

class EventsTrashBin extends Component {
  render() {
    const { connectDropTarget, hovered } = this.props;

    return connectDropTarget(
      <div
        style={{
          border: '1px solid black',
          minHeigh: '100px',
          backgroundColor: hovered ? 'grey' : 'white',
        }}
      >
        <h2 style={{ padding: '5px' }}>Drag event to remove</h2>
      </div>,
    );
  }
}

const spec = {
  drop(props, monitor) {
    const eventUid = monitor.getItem().uid;

    props.removeEvent(eventUid);

    return { eventUid };
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  hovered: monitor.isOver(),
});

export default connect(null, { removeEvent })(DropTarget('event', spec, collect)(EventsTrashBin));
