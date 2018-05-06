import React, { Component } from 'react';

import VirtualizedEventsList from '../events/VirtualizedEventsList';
import SelectedEvents from '../events/SelectedEvents';
import PeopleList from '../people/PeopleList';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h1>Admin Page</h1>
        <div style={{ display: 'flex' }}>
          <PeopleList />
          <SelectedEvents />
        </div>
        <div>
          <VirtualizedEventsList />
        </div>
      </div>
    );
  }
}

export default AdminPage;
