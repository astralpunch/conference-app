import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addEventToPerson, peopleListSelector } from '../../ducks/people';

class EventCard extends Component {
  render() {
    const { connectDropTarget, hovered, canDrop, people } = this.props;
    const { title, when, where } = this.props.event;

    const peopleElement = people && <p>{people.map(person => person.email).join(', ')}</p>;

    return connectDropTarget(
      <div>
        <SCEventCard canDrop={canDrop} hovered={hovered} reactMotionStyle={this.props.style}>
          <h3>{title}</h3>
          <p>
            {where}, {when}
          </p>
          {peopleElement}
        </SCEventCard>
      </div>,
    );
  }
}

const spec = {
  drop(props, monitor) {
    const personUid = monitor.getItem().uid;
    const eventUid = props.event.uid;

    props.addEventToPerson(eventUid, personUid);
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver(),
});

export default connect(
  (state, props) => ({
    people: peopleListSelector(state).filter(
      person => person.events && person.events.includes(props.event.uid),
    ),
  }),
  { addEventToPerson },
)(DropTarget(['person'], spec, collect)(EventCard));

const SCEventCard = styled.div.attrs({
  style: props => props.reactMotionStyle,
})`
  width: 250px;
  min-height: 200px;
  overflow: auto;
  text-align: center;
  margin: 10px;
  padding: 5px;
  margin-right: 20px;
  background-color: ${props => (props.hovered ? '#bea7ce' : '#e5daed')};
`;
