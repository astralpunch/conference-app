import React, { Component } from 'react';

import EventsList from '../events/EventsList';

class Events extends Component {
  render() {
    return (
      <div>
        <h1>Events</h1>
        <EventsList />
      </div>
    );
  }
}

export default Events;
