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
} from "@mui/icons-material";
import { yellow, pink } from "@mui/material/colors";

// Custom Hooks & Styles
import { useLocalStorage } from "../../hooks/useLocalStorage";
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
                <ListItemButton>
                  <ListItemIcon>
                    <DashboardCustomizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Scratchpad" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FavoriteIcon sx={{ color: pink[700] }} />
                  </ListItemIcon>
                  <ListItemText primary="Favorites" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
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
        <Grid width={300} className={styles.mainView__middlePanel}>
          <h1>middle content</h1>
        </Grid>
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
