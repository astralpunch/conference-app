import React, { Component } from 'react';
import styled from 'styled-components';

import VirtualizedEventsList from '../events/VirtualizedEventsList';
import SelectedEvents from '../events/SelectedEvents';
import PeopleList from '../people/PeopleList';
import EventsTrashBin from '../events/EventsTrashBin';

class AdminPage extends Component {
  render() {
    return (
      <Wrapper>
        <MainHeader>Admin Page</MainHeader>
        <Row>
          <VirtualizedEventsList />
          <EventsTrashBin />
        </Row>
        <Header>Drag person to event</Header>
        <Row>
          <PeopleList />
          <SelectedEvents />
        </Row>
      </Wrapper>
    );
  }
}

export default AdminPage;

const MainHeader = styled.h1`
  margin: auto;
  margin-bottom: 50px;
  margin-top: 30px;
`;

const Header = styled.h2`
  margin: auto;
  margin-bottom: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 50px;
`;
