import React, { PropTypes } from 'react';
import Note from './Note';
import Edit from '../../components/Edit';

const Notes = (props) => {
  const { notes, laneId, editNote, updateNoteRequest, deleteNoteRequest } = props;
  return (<ul className='notes'>{notes.map((note) =>
    <Note
      id={note.id}
      key={note.id}
    >
      <Edit
        editing={note.editing}
        value={note.task}
        onValueClick={() => editNote(note.id)}
        onUpdate={(task) => updateNoteRequest({
            ...note,
            task,
            editing: false,
          }, laneId
        )}
        onDelete={() => deleteNoteRequest(note.id, laneId)}
      />
    </Note>
  )}</ul>);
};

Notes.propTypes = {
    deleteNoteRequest: PropTypes.func,
    updateNoteRequest: PropTypes.func,
    laneId: PropTypes.string,
    editNote: PropTypes.func,
    notes: PropTypes.array,
};

export default Notes;
