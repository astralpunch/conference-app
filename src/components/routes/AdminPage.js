import React, { Component } from 'react';
import styled from 'styled-components';

import VirtualizedEventsList from '../events/VirtualizedEventsList';
import SelectedEvents from '../events/SelectedEvents';
import PeopleList from '../people/PeopleList';
import EventsTrashBin from '../events/EventsTrashBin';

class AdminPage extends Component {
  render() {
    return (
      <SCWrapper>
        <SCMainHeader>Admin Page</SCMainHeader>
        <SCRow>
          <VirtualizedEventsList />
          <EventsTrashBin />
        </SCRow>
        <SCHeader>Drag person to event</SCHeader>
        <SCRow>
          <PeopleList />
          <SelectedEvents />
        </SCRow>
      </SCWrapper>
    );
  }
}

export default AdminPage;

const SCMainHeader = styled.h1`
  margin: auto;
  margin-bottom: 50px;
  margin-top: 30px;
`;

const SCHeader = styled.h2`
  margin: auto;
  margin-bottom: 10px;
`;

const SCWrapper = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
`;

const SCRow = styled.div`
  display: flex;
  margin-bottom: 50px;
`;
