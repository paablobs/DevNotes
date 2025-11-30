import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteFolderDialogProps {
  isOpen: boolean;
  folderName: string | undefined;
  onDeleteFolder: () => void;
  onClose: () => void;
}

const DeleteFolderDialog = ({
  isOpen,
  folderName,
  onDeleteFolder,
  onClose,
}: DeleteFolderDialogProps) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Delete Folder</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {`Are you sure you want to delete the folder "${folderName ?? ""}"? This action cannot be undone.`}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onDeleteFolder} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteFolderDialog;
