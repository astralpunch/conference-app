import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import SelectedEventCard from './SelectedEventCard';

import { selectedEventsSelector } from '../../ducks/events';

class SelectedEvents extends Component {
  render() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {interpolated => (
          <ul>
            {interpolated.map(config => (
              <li style={config.style} key={config.key}>
                <SelectedEventCard event={config.data} />
              </li>
            ))}
          </ul>
        )}
      </TransitionMotion>
    );
  }

  willLeave = () => ({
    opacity: spring(0),
  });

  willEnter = () => ({
    opacity: 0,
  });

  getStyles() {
    return this.props.events.map(event => ({
      style: {
        opacity: spring(1, { stiffness: 70 }),
      },
      key: event.uid,
      data: event,
    }));
  }
}

export default connect(state => ({
  events: selectedEventsSelector(state),
}))(SelectedEvents);
