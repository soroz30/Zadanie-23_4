import { connect } from 'react-redux';
import Notes from './Notes';
import * as noteActions from '../Note/NoteActions';
import { moveBetweenLanes, clearLanesChanges, getLanesChanges, updateLanesNotes } from '../Lane/LaneActions';

const mapDispatchToProps = {
  ...noteActions,
  moveBetweenLanes,
  clearLanesChanges,
  updateLanesNotes
};

const mapStateToProps = state => ({
  changes: state.lanes.changes
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
