import { connect } from 'react-redux';
import Lane from './Lane';
import * as laneActions from './LaneActions';
import { deleteLaneRequest, updateLaneRequest, editLane, moveBetweenLanes, clearLanesChanges } from './LaneActions';
import { createNoteRequest } from '../Note/NoteActions';
import { compose } from 'redux';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../Kanban/itemTypes';

const _ = require('lodash');

const mapStateToProps = (state, ownProps) => {
  return {
    laneNotes: ownProps.lane.notes.map(noteId => _.pick(state.notes, noteId)[noteId])
  };
}

const mapDispatchToProps = { 
  editLane,
  deleteLane: deleteLaneRequest,
  updateLane: updateLaneRequest,
  addNote: createNoteRequest,
  moveBetweenLanes,
  clearLanesChanges
};

const noteTarget = {
  drop(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    if (monitor.isOver({ shallow: true })) {
      return {
        sourceId: sourceProps.id,
        sourceLaneId: sourceProps.laneId,
      }
    }
  },
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const { id: noteId, laneId: sourceLaneId } = sourceProps;

    if (monitor.isOver({ shallow: true })) {
      if (targetProps.lane.notes.slice(-1)[0] !== noteId) {
          targetProps.moveBetweenLanes(
            targetProps.lane.id,
            sourceLaneId,
            noteId
          );
        }
    }
  }
}

export default compose(
                 connect(mapStateToProps, mapDispatchToProps),
                 DropTarget(ItemTypes.NOTE, noteTarget, (dragConnect) => ({
                   connectDropTarget: dragConnect.dropTarget()
               })))(Lane);
