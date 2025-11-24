import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  List,
  Divider,
} from "@mui/material";
import {
  DashboardCustomize as DashboardCustomizeIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Clear as ClearIcon,
  Notes as NotesIcon,
  CreateNewFolder as CreateNewFolderIcon,
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
}

const LeftPanel = ({
  currentView,
  selectedFolderId,
  folders,
  onViewChange,
  onFolderSelect,
  onAddFolder,
  onDeleteFolder,
}: LeftPanelProps) => {
  return (
    <List>
      <ListItem>
        <ListItemText>Nout</ListItemText>
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

export default LeftPanel;
