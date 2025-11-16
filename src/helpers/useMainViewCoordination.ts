import { useFoldersManager } from "./useFoldersManager";
import { useNotesManager } from "./useNotesManager";
import { useEditorState } from "./useEditorState";
import { useViewNavigation } from "./useViewNavigation";
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

export interface UseMainViewCoordinationReturn {
  // Folder management
  folders: Folder[];
  open: boolean;
  folderName: string;
  openDeleteDialog: boolean;
  folderToDelete: Folder | null;
  handleClickOpen: () => void;
  handleClose: () => void;
  handleFolderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddFolder: (event: React.FormEvent<HTMLFormElement>) => void;
  handleOpenDeleteDialog: (folder: Folder) => void;
  handleCloseDeleteDialog: () => void;
  handleConfirmDeleteFolder: () => void;
  handleDeleteFolder: (id: string) => void;

  // Note management
  notes: Note[];
  selectedNoteId: string | null;
  getSelectedNote: () => Note | null;
  handleNewNote: () => void;
  handleFavNote: (id: string) => void;
  handleMoveNoteToFolder: (noteId: string, folderId: string) => void;
  handleTrashNote: (id: string) => void;
  handleRestoreNote: (id: string) => void;

  // Editor state
  textAreaValue: string;
  handleEditorChange: (value: string) => void;

  // View navigation
  currentView: SelectedView;
  selectedFolderId: string | null;

  // Set methods for external control
  setCurrentView: (view: SelectedView) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  setSelectedNoteId: (id: string | null) => void;
  setNotes: (value: Note[] | ((prev: Note[]) => Note[])) => void;
}

export const useMainViewCoordination = (): UseMainViewCoordinationReturn => {
  // Initialize all hooks
  const foldersManager = useFoldersManager();
  const viewNavigation = useViewNavigation();
  const notesManager = useNotesManager(
    foldersManager.folders,
    viewNavigation.currentView,
    viewNavigation.selectedFolderId,
  );
  const editorState = useEditorState(
    viewNavigation.currentView,
    notesManager.selectedNoteId,
    notesManager.notes,
  );

  // Handle folder deletion: move notes to trash
  const handleDeleteFolderWithNotes = (folderId: string) => {
    notesManager.setNotes(
      notesManager.notes.map((note) =>
        note.folderId === folderId
          ? {
              ...note,
              isTrash: true,
              folderId: undefined,
              category: "All notes",
            }
          : note,
      ),
    );
    viewNavigation.setSelectedFolderId(null);
    foldersManager.handleDeleteFolder(folderId);
  };

  // Note: Resetting selectedNoteId when leaving scratchpad is handled by
  // the editor state synchronization in handleEditorChangeWithNoteSync.

  // Wrap editor change to also update notes
  const handleEditorChangeWithNoteSync = (value: string) => {
    editorState.handleEditorChange(value);
    if (
      viewNavigation.currentView !== selectedView.SCRATCHPAD &&
      notesManager.selectedNoteId
    ) {
      notesManager.setNotes(
        notesManager.notes.map((n) =>
          n.id === notesManager.selectedNoteId ? { ...n, text: value } : n,
        ),
      );
    }
  };

  // Wrap folder delete to handle note cascading
  const handleDeleteFolderWrapper = (folderId: string) => {
    handleDeleteFolderWithNotes(folderId);
  };

  const handleConfirmDeleteFolderWrapper = () => {
    if (foldersManager.folderToDelete) {
      handleDeleteFolderWrapper(foldersManager.folderToDelete.id);
    }
    foldersManager.handleCloseDeleteDialog();
  };

  return {
    // Folder management
    folders: foldersManager.folders,
    open: foldersManager.open,
    folderName: foldersManager.folderName,
    openDeleteDialog: foldersManager.openDeleteDialog,
    folderToDelete: foldersManager.folderToDelete,
    handleClickOpen: foldersManager.handleClickOpen,
    handleClose: foldersManager.handleClose,
    handleFolderNameChange: foldersManager.handleFolderNameChange,
    handleAddFolder: foldersManager.handleAddFolder,
    handleOpenDeleteDialog: foldersManager.handleOpenDeleteDialog,
    handleCloseDeleteDialog: foldersManager.handleCloseDeleteDialog,
    handleConfirmDeleteFolder: handleConfirmDeleteFolderWrapper,
    handleDeleteFolder: handleDeleteFolderWrapper,

    // Note management
    notes: notesManager.notes,
    selectedNoteId: notesManager.selectedNoteId,
    getSelectedNote: notesManager.getSelectedNote,
    handleNewNote: notesManager.handleNewNote,
    handleFavNote: notesManager.handleFavNote,
    handleMoveNoteToFolder: notesManager.handleMoveNoteToFolder,
    handleTrashNote: notesManager.handleTrashNote,
    handleRestoreNote: notesManager.handleRestoreNote,

    // Editor state
    textAreaValue: editorState.textAreaValue,
    handleEditorChange: handleEditorChangeWithNoteSync,

    // View navigation
    currentView: viewNavigation.currentView,
    selectedFolderId: viewNavigation.selectedFolderId,

    // Set methods
    setCurrentView: viewNavigation.setCurrentView,
    setSelectedFolderId: viewNavigation.setSelectedFolderId,
    setSelectedNoteId: notesManager.setSelectedNoteId,
    setNotes: notesManager.setNotes,
  };
};
