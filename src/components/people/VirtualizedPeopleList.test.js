import React from 'react';
import { shallow, mount } from 'enzyme';
import { VirtualizedPeopleList } from './VirtualizedPeopleList';
import { Table, Column } from 'react-virtualized';

const testPeople = [
  {
    uid: '1524684758854',
    firstName: '123',
    lastName: '123',
    email: 'test1@gmail.com',
  },

  {
    uid: '15332684758854',
    firstName: '123',
    lastName: '123',
    email: 'test2@gmail.com',
  },

  {
    uid: '152432338854',
    firstName: '123',
    lastName: '123',
    email: 'test3@gmail.com',
  },
];

it('should render', () => {
  const container = shallow(<VirtualizedPeopleList people={testPeople} fetchAll={() => {}} />);
  expect(container.length).toEqual(1);
});

// it('should render event list', () => {
//   const container = shallow(<VirtualizedPeopleList fetchAll={() => {}} events={testPeople} />);

//   const rows = container.find('.test--event-list__row');

//   expect(rows.length).toEqual(testPeople.length);
// });

// it('should request fetch data', done => {
//   mount(<VirtualizedPeopleList events={[]} fetchAll={done} />);
// });
