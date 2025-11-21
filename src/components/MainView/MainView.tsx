import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";

// Components & Icons
import {
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import {
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
  yellow,
} from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid";

// Custom Hooks & Styles & Components
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../../utils/selectedView";
import { storageKeys } from "../../utils/storageKeys";
import CustomCard from "../Card/Card";
import Tiptap from "../TextEditor/TipTap";
import LeftPanel from "./LeftPanel/LeftPanel";
import CreateFolderDialog from "./CreateFolderDialog/CreateFolderDialog";
import DeleteFolderDialog from "./DeleteFolderDialog/DeleteFolderDialog";
import EmptyTrashDialog from "./EmptyTrashDialog/EmptyTrashDialog";

// styles
import styles from "./MainView.module.scss";

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

type ColorShades = { [shade: string]: string };

const colorPalette: ColorShades[] = [
  yellow,
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
];

const randomColor = (): string => {
  const colObj = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const preferredShades = [500, 600, 400, 700, 300, 200, 50];
  for (const s of preferredShades) {
    const key = String(s);
    if (colObj[key]) return colObj[key];
  }
  const vals = Object.values(colObj);
  return typeof vals[0] === "string" ? vals[0] : "#FFC107";
};

const MainView = () => {
  const [folders, setFolders] = useLocalStorage<Folder[]>(
    storageKeys.FOLDERS,
    [],
  );
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKeys.NOTES, []);

  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState("");
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
    "Welcome to DevNotes!\n\nThis is your scratchpad. You can write down quick notes here that won't be saved permanently.\n\nFeel free to type anything you want, and it will be saved automatically as you type.",
  );

  const getSelectedNote = () =>
    notes.find((n) => n.id === selectedNoteId) || null;

  const getTextAreaValue = () => {
    if (currentView === selectedView.SCRATCHPAD) return scratchpadValue;
    const note = getSelectedNote();
    return note ? note.text : "";
  };

  const [textAreaValue, setTextAreaValue] = useState(getTextAreaValue());

  useEffect(() => {
    if (currentView !== selectedView.SCRATCHPAD) {
      setSelectedNoteId(null);
    }
    setTextAreaValue(getTextAreaValue());
  }, [currentView]);

  useEffect(() => {
    setTextAreaValue(getTextAreaValue());
  }, [selectedNoteId, notes, scratchpadValue]);

  const handleClickOpen = () => {
    setOpenCreateFolderDialog(true);
  };

  const handleClose = () => {
    setOpenCreateFolderDialog(false);
    setFolderName("");
  };

  const handleFolderNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleAddFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (folderName.trim()) {
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName.trim(),
        color: randomColor(),
      };
      setFolders([newFolder, ...folders]);
      setFolderName("");
    }
    handleClose();
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
    setFolders(folders.filter((folder) => folder.id !== id));
    setNotes(
      notes.map((note) =>
        note.folderId === id
          ? {
              ...note,
              isTrash: true,
              folderId: undefined,
              category: "All notes",
            }
          : note,
      ),
    );
    setSelectedFolderId(null);
  };

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

  const handleEditorChange = (value: string) => {
    setTextAreaValue(value);
    if (currentView === selectedView.SCRATCHPAD) {
      setScratchpadValue(value);
    } else if (selectedNoteId) {
      setNotes(
        notes.map((n) => (n.id === selectedNoteId ? { ...n, text: value } : n)),
      );
    }
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
              onViewChange={setCurrentView}
              onFolderSelect={setSelectedFolderId}
              onAddFolder={handleClickOpen}
              onDeleteFolder={handleOpenDeleteDialog}
            />
          </div>
        </Grid>
        {currentView !== selectedView.SCRATCHPAD && (
          <Grid maxWidth={400} className={styles.mainView__middlePanel}>
            {currentView !== selectedView.TRASH && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNewNote}
                  disabled={currentView === selectedView.SCRATCHPAD}
                  divider
                  sx={{ bgcolor: green[900] }}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="New note" />
                </ListItemButton>
              </ListItem>
            )}
            {currentView === selectedView.NOTES &&
              notes
                .filter((card) => !card.isTrash)
                .map(
                  (card) =>
                    card && (
                      <CustomCard
                        key={card.id}
                        id={card.id}
                        text={card.text}
                        category={card.category}
                        isFav={card.isFav}
                        onFav={handleFavNote}
                        onTrash={handleTrashNote}
                        onMoveToFolder={handleMoveNoteToFolder}
                        folders={folders}
                        folderId={card.folderId}
                        onSelect={setSelectedNoteId}
                        selected={selectedNoteId === card.id}
                      />
                    ),
                )}
            {currentView === selectedView.FAVORITES &&
              notes
                .filter((card) => card.isFav && !card.isTrash)
                .map(
                  (card) =>
                    card && (
                      <CustomCard
                        key={card.id}
                        id={card.id}
                        text={card.text}
                        category={card.category}
                        isFav={card.isFav}
                        onFav={handleFavNote}
                        onTrash={handleTrashNote}
                        onMoveToFolder={handleMoveNoteToFolder}
                        folders={folders}
                        folderId={card.folderId}
                        onSelect={setSelectedNoteId}
                        selected={selectedNoteId === card.id}
                      />
                    ),
                )}
            {currentView === selectedView.FOLDERS &&
              selectedFolderId &&
              notes
                .filter(
                  (note) => note.folderId === selectedFolderId && !note.isTrash,
                )
                .map(
                  (card) =>
                    card && (
                      <CustomCard
                        key={card.id}
                        id={card.id}
                        text={card.text}
                        category={card.category}
                        isFav={card.isFav}
                        onFav={handleFavNote}
                        onTrash={handleTrashNote}
                        onMoveToFolder={handleMoveNoteToFolder}
                        folders={folders}
                        folderId={card.folderId}
                        onSelect={setSelectedNoteId}
                        selected={selectedNoteId === card.id}
                      />
                    ),
                )}
            {currentView === selectedView.TRASH && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setOpenEmptyTrashDialog(true)}
                    divider
                    sx={{ bgcolor: red[900] }}
                  >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Empty Trash" />
                  </ListItemButton>
                </ListItem>
                {notes
                  .filter((card) => card.isTrash)
                  .map(
                    (card) =>
                      card && (
                        <CustomCard
                          key={card.id}
                          id={card.id}
                          text={card.text}
                          category={card.category}
                          isTrash={card.isTrash}
                          onRestore={handleRestoreNote}
                          onSelect={setSelectedNoteId}
                          selected={selectedNoteId === card.id}
                        />
                      ),
                  )}
              </>
            )}
          </Grid>
        )}
        {(selectedNoteId || currentView === selectedView.SCRATCHPAD) && (
          <Grid className={styles.mainView__rightPanel}>
            <Tiptap
              content={textAreaValue}
              onChange={handleEditorChange}
              editable={currentView !== selectedView.TRASH}
            />
          </Grid>
        )}
      </Grid>
      <CreateFolderDialog
        isOpen={openCreateFolderDialog}
        folderName={folderName}
        onFolderNameChange={handleFolderNameChange}
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
          setNotes(notes.filter((n) => !n.isTrash));
          setOpenEmptyTrashDialog(false);
        }}
        onClose={() => setOpenEmptyTrashDialog(false)}
      />
    </div>
  );
};

export default MainView;
