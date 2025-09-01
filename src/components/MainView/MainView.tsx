import { useState, type ChangeEvent, type FormEvent } from "react";

// Components & Icons
import {
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  Divider,
} from "@mui/material";
import {
  DashboardCustomize as DashboardCustomizeIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Clear as ClearIcon,
  Notes as NotesIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from "@mui/icons-material";
import { yellow, pink } from "@mui/material/colors";

// Custom Hooks & Styles & Components
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../../utils/selectedView";
import { storageKeys } from "../../utils/storageKeys";
import CustomCard from "../Card/Card";
import { deleteItemByIdFromLocalStorage } from "../../utils/deleteItemByIdFromLocalStorage";
import { generateId } from "../../utils/generateId";

// styles
import styles from "./MainView.module.scss";

interface Note {
  id: number;
  title: string;
  text: string;
  isFav: boolean;
  isTrash: boolean;
  folderId?: number;
}

interface Folders {
  id: number;
  name: string;
}

const MainView = () => {
  const [folders, setFolders] = useLocalStorage<Folders[]>(
    storageKeys.FOLDERS,
    [],
  );
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKeys.NOTES, []);
  const [favNotes, setFavNotes] = useLocalStorage<Note[]>(
    storageKeys.FAV_NOTES,
    [],
  );
  const [trashNotes, setTrashNotes] = useLocalStorage<Note[]>(
    storageKeys.TRASH_NOTES,
    [],
  );

  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<null | {
    id: number;
    name: string;
  }>(null);
  const [currentView, setCurrentView] = useState<SelectedView>(
    selectedView.NOTES,
  );
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFolderName("");
  };

  const handleFolderNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleAddFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (folderName.trim()) {
      const newFolder = {
        id: generateId(),
        name: folderName.trim(),
      };
      setFolders([newFolder, ...folders]);
    }
    handleClose();
  };

  const handleOpenDeleteDialog = (folder: { id: number; name: string }) => {
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

  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: "Note title",
      text: "This is a new note.",
      isFav: false,
      isTrash: false,
      ...(currentView === selectedView.FOLDERS && selectedFolderId
        ? { folderId: selectedFolderId }
        : {}),
    };
    if (currentView === selectedView.FOLDERS && selectedFolderId) {
      setNotes([newNote, ...notes]);
    } else if (currentView === selectedView.FAVORITES) {
      newNote.isFav = true;
      setNotes([newNote, ...notes]);
      setFavNotes([newNote, ...favNotes]);
    } else if (
      currentView === selectedView.NOTES ||
      currentView === selectedView.SCRATCHPAD
    ) {
      setNotes([newNote, ...notes]);
    }
  };

  const handleFavNote = (id: number) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isFav: !note.isFav };
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      if (updatedNote.isFav) {
        setFavNotes([updatedNote, ...favNotes]);
      } else {
        deleteItemByIdFromLocalStorage(storageKeys.FAV_NOTES, id);
        setFavNotes(favNotes.filter((n) => n.id !== id));
      }
    }
  };

  const handleTrashNote = (id: number) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isTrash: true };
      setNotes(notes.filter((n) => n.id !== id));
      setTrashNotes([updatedNote, ...trashNotes]);
      if (note.isFav) {
        deleteItemByIdFromLocalStorage(storageKeys.FAV_NOTES, id);
        setFavNotes(favNotes.filter((n) => n.id !== id));
      }
    }
  };

  const handleRestoreNote = (id: number) => {
    const note = trashNotes.find((n) => n.id === id);
    if (note) {
      const restoredNote = { ...note, isTrash: false };
      setTrashNotes(trashNotes.filter((n) => n.id !== id));
      setNotes([restoredNote, ...notes, restoredNote]);
      if (note.isFav) {
        setFavNotes([restoredNote, ...favNotes]);
      }
    }
  };

  return (
    <div className={styles.mainView}>
      <Grid container spacing={0} className={styles.mainView__gridContainer}>
        <Grid width={300}>
          <div className={styles.mainView__leftPanel}>
            <List>
              <ListItem>
                <ListItemText className={styles.mainView__leftPanel__logo}>
                  Notero
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentView === selectedView.SCRATCHPAD}
                  onClick={() => setCurrentView(selectedView.SCRATCHPAD)}
                >
                  <ListItemIcon>
                    <DashboardCustomizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Scratchpad" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentView === selectedView.NOTES}
                  onClick={() => setCurrentView(selectedView.NOTES)}
                >
                  <ListItemIcon>
                    <NotesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentView === selectedView.FAVORITES}
                  onClick={() => setCurrentView(selectedView.FAVORITES)}
                >
                  <ListItemIcon>
                    <FavoriteIcon sx={{ color: pink[700] }} />
                  </ListItemIcon>
                  <ListItemText primary="Favorites" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentView === selectedView.TRASH}
                  onClick={() => setCurrentView(selectedView.TRASH)}
                >
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trash" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNewNote}
                  disabled={
                    currentView === selectedView.SCRATCHPAD ||
                    currentView === selectedView.TRASH
                  }
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="New note" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleClickOpen}>
                  <ListItemIcon>
                    <CreateNewFolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add folder" />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ margin: 2 }} />
              {folders.map((folder) => (
                <ListItem
                  key={folder.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDeleteDialog(folder)}
                      aria-label="delete-folder"
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    selected={
                      currentView === selectedView.FOLDERS &&
                      selectedFolderId === folder.id
                    }
                    onClick={() => {
                      setCurrentView(selectedView.FOLDERS);
                      setSelectedFolderId(folder.id);
                    }}
                  >
                    <ListItemIcon>
                      <FolderIcon sx={{ color: yellow[500] }} />
                    </ListItemIcon>
                    <ListItemText primary={folder.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
        {currentView !== selectedView.SCRATCHPAD && (
          <Grid className={styles.mainView__middlePanel}>
            {currentView === selectedView.NOTES &&
              notes.map(
                (card) =>
                  card && (
                    <CustomCard
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      text={card.text}
                      isFav={card.isFav}
                      onFav={handleFavNote}
                      onTrash={handleTrashNote}
                    />
                  ),
              )}
            {currentView === selectedView.FAVORITES &&
              favNotes.map(
                (card) =>
                  card && (
                    <CustomCard
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      text={card.text}
                      isFav={card.isFav}
                      onFav={handleFavNote}
                      onTrash={handleTrashNote}
                    />
                  ),
              )}
            {currentView === selectedView.FOLDERS &&
              selectedFolderId &&
              notes
                .filter((note) => note.folderId === selectedFolderId)
                .map(
                  (card) =>
                    card && (
                      <CustomCard
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        text={card.text}
                        isFav={card.isFav}
                        onFav={handleFavNote}
                        onTrash={handleTrashNote}
                      />
                    ),
                )}
            {currentView === selectedView.TRASH &&
              trashNotes.map(
                (card) =>
                  card && (
                    <CustomCard
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      text={card.text}
                      isTrash={card.isTrash}
                      onRestore={handleRestoreNote}
                    />
                  ),
              )}
          </Grid>
        )}
        <Grid>
          <h1>textgrid area</h1>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleAddFolder}>
          <DialogTitle>Add Folder</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name for the new folder.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="folderName"
              name="folderName"
              label="Folder Name"
              type="text"
              fullWidth
              variant="standard"
              value={folderName}
              onChange={handleFolderNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete the folder "${
              folderToDelete?.name ?? ""
            }"? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDeleteFolder} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainView;
