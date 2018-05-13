import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { eventListSelector } from '../../../../ducks/events';

class PersonCard extends Component {
  componentDidMount() {
    this.props.connectPreview(getEmptyImage());
  }

  render() {
    const { person, virtualizedStyle, connectDragSource, isDragging, events } = this.props;

    return connectDragSource(
      <div>
        <SCPersonCard isDragging={isDragging} virtualizedStyle={virtualizedStyle}>
          <h3>
            {person.firstName}&nbsp;{person.lastName}
          </h3>
          <p>{person.email}</p>
          {!!person.events.length && (
            <p>
              Attending: <Event>{events.map(event => event.title).join(', ')}</Event>
            </p>
          )}
        </SCPersonCard>
      </div>,
    );
  }
}

const spec = {
  beginDrag: props => {
    return {
      uid: props.person.uid,
    };
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

export default connect((state, props) => ({
  events: eventListSelector(state).filter(event => props.person.events.includes(event.uid)),
}))(DragSource('person', spec, collect)(PersonCard));

const SCPersonCard = styled.div.attrs({
  style: props => props.virtualizedStyle,
})`
  width: 200px;
  border: 1px solid #e6e9ed;
  background-color: ${props => (props.isDragging ? '#d0cfd1' : '#fff')};
`;

const Event = styled.span`
  color: paleturquoise;
`;
