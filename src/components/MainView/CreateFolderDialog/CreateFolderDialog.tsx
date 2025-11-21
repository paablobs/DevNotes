import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface CreateFolderDialogProps {
  isOpen: boolean;
  folderName: string;
  onFolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFolder: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const CreateFolderDialog = ({
  isOpen,
  folderName,
  onFolderNameChange,
  onAddFolder,
  onClose,
}: CreateFolderDialogProps) => (
  <Dialog open={isOpen} onClose={onClose}>
    <form onSubmit={onAddFolder}>
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
          onChange={onFolderNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default CreateFolderDialog;
