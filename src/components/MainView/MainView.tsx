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
import { useState } from "react";

// Custom Hooks & Styles & Components
import { useMainViewCoordination } from "../../helpers/useMainViewCoordination";
import { selectedView } from "../../utils/selectedView";
import CustomCard from "../Card/Card";
import Tiptap from "../TextEditor/TipTap";

// styles
import styles from "./MainView.module.scss";

const MainView = () => {
  const {
    // Folder management
    folders,
    open,
    folderName,
    openDeleteDialog,
    folderToDelete,
    handleClickOpen,
    handleClose,
    handleFolderNameChange,
    handleAddFolder,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDeleteFolder,
    // Note management
    notes,
    selectedNoteId,
    handleNewNote,
    handleFavNote,
    handleMoveNoteToFolder,
    handleTrashNote,
    handleRestoreNote,
    // Editor state
    textAreaValue,
    handleEditorChange,
    // View navigation
    currentView,
    selectedFolderId,
    setCurrentView,
    setSelectedFolderId,
    setSelectedNoteId,
    setNotes,
  } = useMainViewCoordination();

  const [openEmptyTrashDialog, setOpenEmptyTrashDialog] = useState(false);

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
                      <FolderIcon sx={{ color: folder.color ?? yellow[500] }} />
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
        {selectedNoteId && (
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
              setNotes((prevNotes) => prevNotes.filter((n) => !n.isTrash));
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
