import React, { Component } from 'react';
import VirtualizedEventsList from '../events/VirtualizedEventsList';
import SelectedEvents from '../events/SelectedEvents';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h1>Admin Page</h1>
        <VirtualizedEventsList />
        <SelectedEvents />
      </div>
    );
  }
}

export default AdminPage;
