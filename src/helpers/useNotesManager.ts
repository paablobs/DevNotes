import { useState, type Dispatch, type SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { storageKeys } from "../utils/storageKeys";
import { selectedView, type SelectedView } from "../utils/selectedView";

interface Note {
  id: string;
  text: string;
  category: string;
  isFav: boolean;
  isTrash: boolean;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface UseNotesManagerReturn {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  selectedNoteId: string | null;
  setSelectedNoteId: Dispatch<SetStateAction<string | null>>;
  getSelectedNote: () => Note | null;
  handleNewNote: () => void;
  handleFavNote: (id: string) => void;
  handleMoveNoteToFolder: (noteId: string, folderId: string) => void;
  handleTrashNote: (id: string) => void;
  handleRestoreNote: (id: string) => void;
}

export const useNotesManager = (
  folders: Folder[],
  currentView: SelectedView,
  selectedFolderId: string | null,
): UseNotesManagerReturn => {
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKeys.NOTES, []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const getSelectedNote = () =>
    notes.find((n) => n.id === selectedNoteId) || null;

  const handleNewNote = () => {
    let category = "All notes";
    if (currentView === selectedView.FOLDERS && selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder) category = folder.name;
    }
    const newNote: Note = {
      id: uuidv4(),
      text: "",
      category,
      isFav: currentView === selectedView.FAVORITES,
      isTrash: false,
      ...(currentView === selectedView.FOLDERS && selectedFolderId
        ? { folderId: selectedFolderId }
        : {}),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleFavNote = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isFav: !note.isFav };
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
    }
  };

  const handleMoveNoteToFolder = (noteId: string, folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    setNotes(
      notes.map((n) =>
        n.id === noteId
          ? { ...n, folderId, category: folder ? folder.name : n.category }
          : n,
      ),
    );
  };

  const handleTrashNote = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isTrash: true };
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
    }
    setSelectedNoteId(null);
  };

  const handleRestoreNote = (id: string) => {
    const note = notes.find((n) => n.id === id && n.isTrash);
    if (note) {
      const restoredNote = { ...note, isTrash: false };
      setNotes(notes.map((n) => (n.id === id ? restoredNote : n)));
    }
  };

  return {
    notes,
    setNotes,
    selectedNoteId,
    setSelectedNoteId,
    getSelectedNote,
    handleNewNote,
    handleFavNote,
    handleMoveNoteToFolder,
    handleTrashNote,
    handleRestoreNote,
  };
};
