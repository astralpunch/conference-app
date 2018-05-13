import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Transition } from 'react-spring';

import SelectedEventCard from './SelectedEventCard';

import { selectedEventsSelector } from '../../../ducks/events';

class SelectedEvents extends Component {
  render() {
    return (
      <SelectedEventsWrapper>
        <Transition
          keys={this.props.events.map(event => event.uid)}
          from={{ opacity: 0, height: 0 }}
          enter={{ opacity: 1, height: 100 }}
          leave={{ opacity: 0, height: 0 }}
        >
          {this.props.events.map(event => styles => (
            <SelectedEventCard style={styles} key={event.uid} event={event} />
          ))}
        </Transition>
      </SelectedEventsWrapper>
    );
  }
}

const SelectedEventsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
  width: 870px;
  height: 400px;
  margin: 5px;
  border: 1px solid black;
`;

export default connect(state => ({
  events: selectedEventsSelector(state),
}))(SelectedEvents);
