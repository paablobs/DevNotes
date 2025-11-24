import { useEffect, useEffectEvent, useState } from "react";

// Components & Icons
import { Grid } from "@mui/material";

// Custom Hooks & Styles & Components
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../../utils/selectedView";
import Tiptap from "../TextEditor/TipTap";
import CreateFolderDialog from "./CreateFolderDialog/CreateFolderDialog";
import DeleteFolderDialog from "./DeleteFolderDialog/DeleteFolderDialog";
import EmptyTrashDialog from "./EmptyTrashDialog/EmptyTrashDialog";
import LeftPanel from "./LeftPanel/LeftPanel";

// styles
import useNotes from "../../hooks/useNotes";
import styles from "./MainView.module.scss";
import MiddlePanel from "./MiddlePanel/MiddlePanel";

export interface Note {
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

const MainView = () => {
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<null | Folder>(null);
  const [openEmptyTrashDialog, setOpenEmptyTrashDialog] = useState(false);
  const [currentView, setCurrentView] = useState<SelectedView>(
    selectedView.NOTES,
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [scratchpadValue, setScratchpadValue] = useLocalStorage<string>(
    "scratchpad",
    "Welcome to Nout!\n\nThis is your scratchpad. You can write down quick notes here that won't be saved permanently.\n\nFeel free to type anything you want, and it will be saved automatically as you type.",
  );

  const {
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
  } = useNotes();

  const selectInitialNote = useEffectEvent(
    (view = currentView, folderId = selectedFolderId) => {
      if (view === selectedView.SCRATCHPAD) {
        setSelectedNoteId(null);
      } else if (view === selectedView.NOTES) {
        setSelectedNoteId(notes.find((n) => !n.isTrash)?.id || null);
      } else if (view === selectedView.FAVORITES) {
        setSelectedNoteId(notes.find((n) => n.isFav && !n.isTrash)?.id || null);
      } else if (view === selectedView.TRASH) {
        setSelectedNoteId(notes.find((n) => n.isTrash)?.id || null);
      } else if (view === selectedView.FOLDERS && folderId) {
        const firstFolderNote = notes.find(
          (note) => note.folderId === folderId && !note.isTrash,
        );
        setSelectedNoteId(firstFolderNote ? firstFolderNote.id : null);
      }
    },
  );

  useEffect(() => {
    selectInitialNote();
  }, []);

  const getSelectedNote = () => getNoteById(selectedNoteId || "") || null;

  const handleClickOpen = () => {
    setOpenCreateFolderDialog(true);
  };

  // Close Create Folder Dialog - Necessary for the Dialog MUI component
  const handleClose = () => {
    setOpenCreateFolderDialog(false);
  };

  const handleAddFolder = (folderName: string) => {
    addFolder(folderName);
  };

  const handleOpenDeleteDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setFolderToDelete(null);
  };

  const handleConfirmDeleteFolder = () => {
    if (folderToDelete) {
      handleDeleteFolder(folderToDelete.id);
    }
    handleCloseDeleteDialog();
  };

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id);
    setSelectedFolderId(null);
  };

  const handleNewNote = () => {
    const noteId = addNote(currentView, selectedFolderId || undefined);
    setSelectedNoteId(noteId);
  };

  const handleFavNote = (id: string) => {
    addFavorite(id);
  };

  const handleMoveNoteToFolder = (noteId: string, folderId: string | null) => {
    moveNoteToFolder(noteId, folderId);
  };

  const handleTrashNote = (id: string) => {
    deleteNotes([id]);
    setSelectedNoteId(null);
  };

  const handleRestoreNote = (id: string) => {
    restoreNote(id);
  };

  const handleEditorChange = (value: string) => {
    if (currentView === selectedView.SCRATCHPAD) {
      setScratchpadValue(value);
    } else if (selectedNoteId) {
      updateNoteText(selectedNoteId, value);
    }
  };

  const getEditorContent = () => {
    if (currentView === selectedView.SCRATCHPAD) {
      return scratchpadValue;
    } else {
      const note = getSelectedNote();
      return note ? note.text : "";
    }
  };

  const handleViewChange = (view: SelectedView) => {
    setCurrentView(view);
    if (view !== selectedView.FOLDERS) {
      selectInitialNote(view);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    selectInitialNote(selectedView.FOLDERS, folderId);
  };

  return (
    <div className={styles.mainView}>
      <Grid container spacing={0} className={styles.mainView__gridContainer}>
        <Grid width={300}>
          <div className={styles.mainView__leftPanel}>
            <LeftPanel
              currentView={currentView}
              selectedFolderId={selectedFolderId}
              folders={folders}
              onViewChange={handleViewChange}
              onFolderSelect={handleFolderSelect}
              onAddFolder={handleClickOpen}
              onDeleteFolder={handleOpenDeleteDialog}
            />
          </div>
        </Grid>
        {currentView !== selectedView.SCRATCHPAD && (
          <Grid maxWidth={400} className={styles.mainView__middlePanel}>
            <MiddlePanel
              currentView={currentView}
              notes={notes}
              folders={folders}
              selectedFolderId={selectedFolderId}
              selectedNoteId={selectedNoteId}
              onNewNote={handleNewNote}
              onFavNote={handleFavNote}
              onTrashNote={handleTrashNote}
              onMoveNoteToFolder={handleMoveNoteToFolder}
              onRestoreNote={handleRestoreNote}
              onCardSelect={setSelectedNoteId}
              onEmptyTrash={() => setOpenEmptyTrashDialog(true)}
            />
          </Grid>
        )}
        {(selectedNoteId || currentView === selectedView.SCRATCHPAD) && (
          <Grid size="grow" className={styles.mainView__rightPanel}>
            <Tiptap
              content={getEditorContent()}
              onChange={handleEditorChange}
              editable={currentView !== selectedView.TRASH}
            />
          </Grid>
        )}
      </Grid>
      <CreateFolderDialog
        isOpen={openCreateFolderDialog}
        onAddFolder={handleAddFolder}
        onClose={handleClose}
      />
      <DeleteFolderDialog
        isOpen={openDeleteDialog}
        folderName={folderToDelete?.name}
        onDeleteFolder={handleConfirmDeleteFolder}
        onClose={handleCloseDeleteDialog}
      />
      <EmptyTrashDialog
        isOpen={openEmptyTrashDialog}
        onEmptyTrash={() => {
          deleteNotes(
            notes.filter((note) => note.isTrash).map((n) => n.id),
            true,
          );
          setOpenEmptyTrashDialog(false);
        }}
        onClose={() => setOpenEmptyTrashDialog(false)}
      />
    </div>
  );
};

export default MainView;
