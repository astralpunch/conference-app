import React, { Component } from 'react';

import VirtualizedEventsList from '../events/VirtualizedEventsList';
import SelectedEvents from '../events/SelectedEvents';
import PeopleList from '../people/PeopleList';
import EventsTrashBin from '../events/EventsTrashBin';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h1>Admin Page</h1>
        <div style={{ display: 'flex' }}>
          <PeopleList />
          <SelectedEvents />
        </div>
        <div style={{ display: 'flex' }}>
          <VirtualizedEventsList />
          <EventsTrashBin />
        </div>
      </div>
    );
  }
}

export default AdminPage;
