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
  Notes,
} from "@mui/icons-material";
import { yellow, pink } from "@mui/material/colors";
import CustomCard from "../Card/Card";

// Custom Hooks & Styles
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../../utils/selectedView";

// styles
import styles from "./MainView.module.scss";

const MainView = () => {
  const [folders, setFolders] = useLocalStorage("folders", [
    { id: 1, name: "folder placeholder" },
  ]);
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<null | {
    id: number;
    name: string;
  }>(null);
  const [currentView, setCurrentView] = useState<SelectedView>(
    selectedView.SCRATCHPAD,
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
        id: folders.length + 1,
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

  const notesCardExamples = [
    { key: "Card 1", title: "Card 1", text: "This is the first card." },
    { key: "Card 2", title: "Card 2", text: "This is the second card." },
    { key: "Card 3", title: "Card 3", text: "This is the third card." },
    { key: "Card 4", title: "Card 4", text: "This is the fourth card." },
    { key: "Card 5", title: "Card 5", text: "This is the fifth card." },
    { key: "Card 6", title: "Card 6", text: "This is the sixth card." },
    { key: "Card 7", title: "Card 7", text: "This is the seventh card." },
    { key: "Card 8", title: "Card 8", text: "This is the eighth card." },
    { key: "Card 9", title: "Card 9", text: "This is the ninth card." },
    { key: "Card 10", title: "Card 10", text: "This is the tenth card." },
  ];

  const favCardExamples = [
    { key: "Card 1", title: "Card 1", text: "This is the first card." },
    { key: "Card 2", title: "Card 2", text: "This is the second card." },
  ];
  const trashCardExamples = [
    { key: "Card 1", title: "Card 1", text: "This is the first card." },
  ];

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
                    <Notes />
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
                <ListItemButton onClick={handleClickOpen}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Folder" />
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
          <Grid width={300} className={styles.mainView__middlePanel}>
            {currentView === selectedView.NOTES &&
              notesCardExamples.map((card) => (
                <CustomCard
                  key={card.key}
                  title={card.title}
                  text={card.text}
                />
              ))}
            {currentView === selectedView.FAVORITES &&
              favCardExamples.map((card) => (
                <CustomCard
                  key={card.key}
                  title={card.title}
                  text={card.text}
                />
              ))}
            {currentView === selectedView.TRASH &&
              trashCardExamples.map((card) => (
                <CustomCard
                  key={card.key}
                  title={card.title}
                  text={card.text}
                />
              ))}
          </Grid>
        )}
        <Grid>
          <h1>textgrid area</h1>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleAddFolder,
        }}
      >
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
