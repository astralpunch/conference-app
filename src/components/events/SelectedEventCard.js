import React, { Component } from 'react';

class SelectedEventCard extends Component {
  render() {
    const { event } = this.props;

    return (
      <div>
        <h3>{event.title}</h3>
        <p>
          {event.where} {event.when}
        </p>
      </div>
    );
  }
}

export default SelectedEventCard;
