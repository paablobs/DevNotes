import * as React from "react";
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
} from "@mui/material";
import List from "@mui/material/List";
import { yellow } from "@mui/material/colors";
import { pink } from "@mui/material/colors";

//Icons
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import styles from "./MainView.module.scss";

const MainView = () => {
  const [folders, setFolders] = useLocalStorage("folders", [
    { id: 1, name: "folder placeholder" },
  ]);
  const [open, setOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFolderName("");
  };

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFolderName(event.target.value);
  };

  const handleAddFolder = (event: React.FormEvent<HTMLFormElement>) => {
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
              {folders.map((folder: { id: number; name: string }) => (
                <ListItem key={folder.id}>
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
    </div>
  );
};

export default MainView;
