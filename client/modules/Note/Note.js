import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from '../Kanban/itemTypes';
import { compose } from 'redux';

// Import Style
import styles from './Note.css';

class Note extends React.Component {
  render() {
   const {
     connectDragSource,
     connectDropTarget,
     isDragging,
     editing,
     children,
     changes
    } = this.props;

    const dragSource = editing ? a => a : connectDragSource;

    return dragSource(connectDropTarget(
     <li
       className={styles.Note}
       style={{
         opacity: isDragging ? 0 : 1,
       }}
     >
       {children}
     </li>
   ));

  }
}

Note.propTypes = {
  children: PropTypes.any,
};

const noteSource = {
  beginDrag(props) {
    return {
      id: props.id,
      laneId: props.laneId,
      clearLanesChanges: props.clearLanesChanges
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
  endDrag(props, monitor) {
    props.updateLanesNotes(monitor.getDropResult().changes);
    props.clearLanesChanges();
  }
};

const noteTarget = {
  drop(targetProps, monitor) {
    const sourceProps = monitor.getItem();

    return {
      sourceId: sourceProps.id,
      sourceLaneId: sourceProps.laneId,
      changes: targetProps.changes,
    }
  },
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();

    if (targetProps.id !== sourceProps.id) {
      if (sourceProps.laneId === targetProps.laneId) {
        targetProps.moveWithinLane(targetProps.laneId, targetProps.id, sourceProps.id);
      } else if (targetProps.id !== sourceProps.id) {
        targetProps.moveBetweenLanes(targetProps.laneId, sourceProps.laneId, sourceProps.id, targetProps.id);
      }
    }
  }
}

export default compose(
                  DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
                    connectDragSource: connect.dragSource(),
                    isDragging: monitor.isDragging()
                  })),
                  DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
                    connectDropTarget: connect.dropTarget()
                  }))
                )(Note);
