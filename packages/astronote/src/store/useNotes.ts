import create from "zustand";
import {
  createNoteAsync,
  deleteNoteAsync,
  getNotesAsync,
  updateNoteAsync,
} from "../api/noteApi";
import { CreateNoteInputs, UpdateNoteInputs } from "../types/forms";
import Note from "../types/note";

interface NotesStore {
  notes: Note[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  fetch: () => Promise<void>;
  createNote: (value: CreateNoteInputs) => Promise<Note>;
  updateNote: (id: string, value: UpdateNoteInputs) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<Note | null>;
}

const useNotes = create<NotesStore>((set, get) => ({
  notes: [],
  selectedId: null,
  fetch: async () => {
    try {
      const notes = await getNotesAsync();
      set((state) => ({
        ...state,
        notes,
      }));
      console.log("NOTES FETCH SUCCESS", notes);
    } catch (e) {
      console.log("FAILED TO FETCH NOTES", e);
    }
  },
  setSelectedId: (id: string | null) => {
    set((state) => ({
      ...state,
      selectedId: id,
    }));
  },
  createNote: async (value) => {
    const note = await createNoteAsync(value);
    set((state) => ({
      ...state,
      notes: [...state.notes, note],
    }));
    return note;
  },
  updateNote: async (id, value) => {
    const actualNote = get().notes.find((item) => item.id === id);
    if (!actualNote) return null;

    // Updating the state right way
    set((state) => ({
      ...state,
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...value,
            }
          : note
      ),
    }));

    try {
      // Updating the note in the backend
      const updatedNote = await updateNoteAsync(id, value);
      // replacing the localy updated note with the updated note from the backend
      set((state) => ({
        ...state,
        notes: state.notes.map((item) => (item.id === id ? updatedNote : item)),
      }));
      return updatedNote;
    } catch (e) {
      console.log("FAILED TO UPDATE NOTE", e);
      // Assigning the old note
      set((state) => ({
        ...state,
        notes: state.notes.map((item) => (item.id === id ? actualNote : item)),
      }));
      return null;
    }
  },
  deleteNote: async (id) => {
    const actualNote = get().notes.find((item) => item.id === id);
    if (!actualNote) return null;
    set((state) => ({
      ...state,
      notes: state.notes.filter((item) => item.id !== id),
    }));
    try {
      const deletedNote = await deleteNoteAsync(id);
      return deletedNote;
    } catch (e) {
      console.log("FAILED TO DELETE NOTE", e);

      // Putting back the original note
      set((state) => ({
        ...state,
        notes: [...state.notes, actualNote],
      }));
      return null;
    }
  },
}));

export default useNotes;
