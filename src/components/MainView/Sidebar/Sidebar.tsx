import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  List,
  Divider,
  Button,
} from "@mui/material";
import {
  DashboardCustomize as DashboardCustomizeIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Clear as ClearIcon,
  Notes as NotesIcon,
  CreateNewFolder as CreateNewFolderIcon,
  EditNote as NewNoteIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { yellow } from "@mui/material/colors";

import { selectedView, type SelectedView } from "../../../utils/selectedView";

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface LeftPanelProps {
  currentView: SelectedView;
  selectedFolderId: string | null;
  folders: Folder[];
  onViewChange: (view: SelectedView) => void;
  onFolderSelect: (folderId: string) => void;
  onAddFolder: () => void;
  onDeleteFolder: (folder: Folder) => void;
  onNewNote: () => void;
}

const Sidebar = ({
  currentView,
  selectedFolderId,
  folders,
  onViewChange,
  onFolderSelect,
  onAddFolder,
  onDeleteFolder,
  onNewNote,
}: LeftPanelProps) => {
  return (
    <List>
      <ListItem sx={{ paddingRight: 0, paddingTop: 0 }}>
        <ListItemText
          slotProps={{ primary: { fontSize: "2rem", fontWeight: "bold" } }}
        >
          <CodeIcon
            sx={{
              fontSize: "3rem",
              marginRight: 1,
              verticalAlign: "top",
            }}
          />
          Nout
        </ListItemText>
        {currentView !== selectedView.TRASH && (
          <Button
            variant="contained"
            color="secondary"
            onClick={onNewNote}
            sx={{
              aspectRatio: "1 / 1",
              minWidth: 0,
              borderRadius: "50%",
              padding: 1,
            }}
          >
            <NewNoteIcon fontSize="large" />
          </Button>
        )}
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={currentView === selectedView.SCRATCHPAD}
          onClick={() => onViewChange(selectedView.SCRATCHPAD)}
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
          onClick={() => onViewChange(selectedView.NOTES)}
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
          onClick={() => onViewChange(selectedView.FAVORITES)}
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
          onClick={() => onViewChange(selectedView.TRASH)}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={onAddFolder}>
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
              onClick={() => onDeleteFolder(folder)}
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
              onViewChange(selectedView.FOLDERS);
              onFolderSelect(folder.id);
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
  );
};

export default Sidebar;
