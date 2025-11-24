import { selectedView } from "../utils/selectedView";
import { storageKeys } from "../utils/storageKeys";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import randomColor from "../utils/randomColor";

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface Note {
  id: string;
  text: string;
  category: string;
  isFav: boolean;
  isTrash: boolean;
  folderId?: string;
}

const DEFAULT_CATEGORY = "All notes";

const useNotes = () => {
  const [folders, setFolders] = useLocalStorage<Folder[]>(
    storageKeys.FOLDERS,
    [],
  );
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKeys.NOTES, []);

  const addNote = (currentView: string, selectedFolderId?: string) => {
    let category = DEFAULT_CATEGORY;
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
    return newNote.id;
  };

  const addFolder = (folderName: string) => {
    if (folderName.trim()) {
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName.trim(),
        color: randomColor(),
      };
      setFolders([newFolder, ...folders]);
    }
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter((folder) => folder.id !== id));
    setNotes(
      notes.map((note) =>
        note.folderId === id
          ? {
              ...note,
              isTrash: true,
              folderId: undefined,
              category: DEFAULT_CATEGORY,
            }
          : note,
      ),
    );
  };

  const addFavorite = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isFav: !note.isFav };
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
    }
  };

  const moveNoteToFolder = (noteId: string, folderId: string | null) => {
    const folder = folderId
      ? folders.find((f) => f.id === folderId)
      : undefined;
    setNotes(
      notes.map((n) =>
        n.id === noteId
          ? {
              ...n,
              folderId: folderId ?? undefined,
              category: folder ? folder.name : n.category,
            }
          : n,
      ),
    );
  };

  const deleteNotes = (ids: string[], permanent = false) => {
    if (permanent) {
      setNotes(notes.filter((n) => !ids.includes(n.id)));
    } else {
      setNotes(
        notes.map((n) => (ids.includes(n.id) ? { ...n, isTrash: true } : n)),
      );
    }
  };

  const restoreNote = (id: string) => {
    const note = notes.find((n) => n.id === id && n.isTrash);
    if (note) {
      const restoredNote = { ...note, isTrash: false };
      setNotes(notes.map((n) => (n.id === id ? restoredNote : n)));
    }
  };

  const getNoteById = (id: string) => {
    return notes.find((n) => n.id === id) || null;
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  return {
    notes,
    folders,
    addNote,
    addFolder,
    deleteFolder,
    addFavorite,
    moveNoteToFolder,
    deleteNotes,
    restoreNote,
    getNoteById,
    updateNoteText,
  };
};

export default useNotes;
