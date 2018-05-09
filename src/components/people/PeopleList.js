import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import PersonCard from './PersonCard';

import { peopleListSelector, fetchAllPeople } from '../../ducks/people';

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchAllPeople();
  }

  render() {
    return (
      // <List
      //   rowCount={this.props.people.length}
      //   rowHeight={100}
      //   height={300}
      //   width={200}
      //   rowRenderer={this.rowRenderer}
      // />

      <TransitionMotion
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {interpolated => (
          <List
            rowCount={this.props.people.length}
            rowHeight={100}
            height={300}
            width={200}
            rowRenderer={this.rowRenderer}
          />
          // <ul>
          //   {interpolated.map(config => (
          //     <li style={config.style} key={config.key}>
          //       <SelectedEventCard event={config.data} />
          //     </li>
          //   ))}
          // </ul>
        )}
      </TransitionMotion>
    );
    // );
  }

  getStyles() {
    return this.props.people.map(person => ({
      style: {
        opacity: spring(1, { stiffness: 70 }),
      },
      key: person.uid,
      data: person,
    }));
  }

  rowRenderer = ({ index, key, style }) => (
    <PersonCard person={this.props.people[index]} key={key} style={style} />
  );
}

export default connect(
  state => ({
    people: peopleListSelector(state),
  }),
  { fetchAllPeople },
)(PeopleList);
