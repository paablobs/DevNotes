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
}

const MainView = () => {
  const [folders, setFolders] = useLocalStorage(storageKeys.FOLDERS, [
    { id: generateId(), name: "folder placeholder" },
  ]);
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
      setFolders([...folders, newFolder]);
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
    const newNote = {
      id: generateId(),
      title: "Note title",
      text: "This is a new note.",
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id: number) => {
    deleteItemByIdFromLocalStorage(storageKeys.NOTES, id);
    setNotes(notes.filter((note) => note.id !== id));
  };
  const handleDeleteFavNote = (id: number) => {
    deleteItemByIdFromLocalStorage(storageKeys.FAV_NOTES, id);
    setFavNotes(favNotes.filter((note) => note.id !== id));
  };
  const handleDeleteTrashNote = (id: number) => {
    deleteItemByIdFromLocalStorage(storageKeys.TRASH_NOTES, id);
    setTrashNotes(trashNotes.filter((note) => note.id !== id));
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
                <ListItemButton onClick={handleNewNote}>
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
              {folders.map((folder: { id: number; name: string }) => (
                <ListItem
                  key={folder.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDeleteDialog(folder)}
                      aria-label="delete-folder"
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton>
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
                      storageKey={storageKeys.NOTES}
                      title={card.title}
                      text={card.text}
                      onDelete={handleDeleteNote}
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
                      storageKey={storageKeys.FAV_NOTES}
                      title={card.title}
                      text={card.text}
                      isFav
                      onDelete={handleDeleteFavNote}
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
                      storageKey={storageKeys.TRASH_NOTES}
                      title={card.title}
                      text={card.text}
                      isTrash
                      onDelete={handleDeleteTrashNote}
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
