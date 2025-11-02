import {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
} from "react";

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
  Star as StarIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Clear as ClearIcon,
  Notes as NotesIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from "@mui/icons-material";
import { yellow, green, red } from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid";

// Custom Hooks & Styles & Components
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../../utils/selectedView";
import { storageKeys } from "../../utils/storageKeys";
import CustomCard from "../Card/Card";
import Tiptap from "../TextEditor/TipTap";

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
}

const MainView = () => {
  const [folders, setFolders] = useLocalStorage<Folder[]>(
    storageKeys.FOLDERS,
    [],
  );
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKeys.NOTES, []);

  const [open, setOpen] = useState(false);
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

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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

  useEffect(() => {
    if (selectedNoteId && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [selectedNoteId]);

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
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName.trim(),
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
    setNotes(notes.filter((note) => note.folderId !== id));
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

  const handleTrashNote = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNote = { ...note, isTrash: true };
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
    }
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
            <List>
              <ListItem>
                <ListItemText className={styles.mainView__leftPanel__logo}>
                  DevNotes
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
                  <ListItemText primary="All notes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentView === selectedView.FAVORITES}
                  onClick={() => setCurrentView(selectedView.FAVORITES)}
                >
                  <ListItemIcon>
                    <StarIcon sx={{ color: yellow[700] }} />
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
        {(currentView === selectedView.SCRATCHPAD ||
          (selectedNoteId &&
            (currentView === selectedView.NOTES ||
              currentView === selectedView.FAVORITES ||
              currentView === selectedView.FOLDERS ||
              currentView === selectedView.TRASH))) && (
          <Grid className={styles.mainView__rightPanel}>
            <Tiptap
              content={textAreaValue}
              onChange={handleEditorChange}
              editable={currentView !== selectedView.TRASH}
            />
          </Grid>
        )}
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
      <Dialog
        open={openEmptyTrashDialog}
        onClose={() => setOpenEmptyTrashDialog(false)}
      >
        <DialogTitle>Empty Trash</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete all notes in the trash?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmptyTrashDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setNotes(notes.filter((n) => !n.isTrash));
              setOpenEmptyTrashDialog(false);
            }}
            color="error"
          >
            Empty Trash
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainView;
