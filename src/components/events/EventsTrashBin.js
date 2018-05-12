import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { removeEvent } from '../../ducks/events';

class EventsTrashBin extends Component {
  render() {
    const { connectDropTarget, hovered } = this.props;

    return connectDropTarget(
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Wrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            x="0px"
            y="0px"
            width="30px"
            height="30px"
            viewBox="0 0 512 512"
            space="preserve"
          >
            <path
              fill={hovered ? 'grey' : '#1D1D1B'}
              d="M459.232,60.687h-71.955c-1.121-17.642-15.631-31.657-33.553-31.657H161.669  c-17.921,0-32.441,14.015-33.553,31.657H64.579c-18.647,0-33.767,15.12-33.767,33.768v8.442c0,18.648,15.12,33.768,33.767,33.768  h21.04v342.113c0,13.784,11.179,24.963,24.963,24.963h308.996c13.784,0,24.964-11.179,24.964-24.963V136.665h14.691  c18.663,0,33.768-15.12,33.768-33.768v-8.442C493,75.807,477.896,60.687,459.232,60.687z M196.674,443.725  c0,12.58-10.197,22.803-22.802,22.803c-12.598,0-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.205-22.802,22.803-22.802  c12.605,0,22.802,10.206,22.802,22.802V443.725z M287.887,443.725c0,12.58-10.205,22.803-22.803,22.803  s-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.205-22.802,22.803-22.802s22.803,10.206,22.803,22.802V443.725z M379.099,443.725  c0,12.58-10.205,22.803-22.803,22.803c-12.613,0-22.803-10.223-22.803-22.803v-284.9c0-12.597,10.189-22.802,22.803-22.802  c12.598,0,22.803,10.206,22.803,22.802V443.725z"
            />
          </svg>
          <div>Drag event to remove</div>
        </Wrapper>
      </div>,
    );
  }
}

const spec = {
  drop(props, monitor) {
    const eventUid = monitor.getItem().uid;

    props.removeEvent(eventUid);
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  hovered: monitor.isOver(),
});

export default connect(null, { removeEvent })(DropTarget('event', spec, collect)(EventsTrashBin));

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;
