import React from 'react';
import { shallow, mount } from 'enzyme';
import { VirtualizedPeopleList } from './VirtualizedPeopleList';

const generateList = length => {
  return [...new Array(length).keys()].reduce(
    (acc, elem) => [
      ...acc,
      {
        firstName: Math.random().toString(),
        lastName: Math.random().toString(),
        email: Math.random().toString(),
      },
    ],
    [],
  );
};

it('should render', done => {
  const container = shallow(<VirtualizedPeopleList people={generateList(10)} fetchAll={done} />);
  expect(container.length).toEqual(1);
});

it('should render a part of long list', done => {
  const longList = generateList(200);

  const container = mount(<VirtualizedPeopleList fetchAll={done} people={longList} />);
  const rows = container.find('.test--people-list__row');

  expect(rows.length).toEqual(10);
});
