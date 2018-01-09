import Note from '../models/note';
import Lane from '../models/lane';
import uuid from 'uuid';

import omit from 'lodash/omit';

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    return res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });
  
  newNote.id = uuid();
  newNote.save((err, savedNote) => {
    if (err) {
      res.status(500).send(err)
    }
    Lane.findOne({ id: laneId })
        .then(lane => {
          lane.notes.push(savedNote);
          return lane.save((err, savedLane) => {
            if (err) {
              res.status(500).send(err);
            }
          })
        })
    res.json(savedNote)
  });
}

export function deleteNote(req, res) {
  const noteId = req.params.noteId
  Note.findOne({ id: noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.remove(() => {
      Lane.findOne({id: req.body.laneId}).exec((err, lane) => {
        const updatedNotes = lane.notes.filter(note => note.id !== noteId);
        lane.notes = updatedNotes;
        lane.save();
        res.json(note);
      });
    });
  });
}

export function updateTask(req, res) {
  const newTask = req.body.note.task;
  Note.findOneAndUpdate({ id: req.params.noteId }, {$set: {task: newTask}}, {new: true})
      .exec((err, note) => {
        if (err) {
          res.status(500).send(err);
        }
        Lane.findOne({id: req.body.laneId}).exec((err, lane) => {
          const notesIndex = lane.notes.findIndex(note => note.id === req.params.noteId);
          lane.notes[notesIndex].task = newTask;
          lane.save();
          res.json(note);
        });
      });
}
