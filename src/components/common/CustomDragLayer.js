import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';

import PersonCardDragPreview from '../people/PeopleList/PersonCard/PersonCardDragPreview';
import SelectedEventDragPreview from '../events/SelectedEvents/SelectedEventDragPreview';

const layerStyle = {
  position: 'fixed',
  pointerEvents: 'none',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 10000,
};

const previewMap = {
  person: PersonCardDragPreview,
  event: SelectedEventDragPreview,
};

class CustomDragLayer extends Component {
  getItem() {
    const { offset, item, itemType } = this.props;

    const PreviewComponent = previewMap[itemType];

    if (!offset || !PreviewComponent) return null;

    const { x, y } = offset;
    const style = {
      transform: `translate(${x}px, ${y - 25}px)`,
    };

    return (
      <div style={style}>
        <PreviewComponent {...item} />
      </div>
    );
  }

  render() {
    const { isDragging } = this.props;

    if (!isDragging) return null;

    const item = this.getItem();

    if (!item) return null;

    return <div style={layerStyle}>{item}</div>;
  }
}

const collect = monitor => ({
  isDragging: monitor.isDragging(),
  offset: monitor.getClientOffset(),
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
});

export default DragLayer(collect)(CustomDragLayer);
