import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface EmptyTrashDialogProps {
  isOpen: boolean;
  onEmptyTrash: () => void;
  onClose: () => void;
}

const EmptyTrashDialog = ({
  isOpen,
  onEmptyTrash,
  onClose,
}: EmptyTrashDialogProps) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Empty Trash</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to permanently delete all notes in the trash? This
        action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onEmptyTrash} color="error" variant="contained">
        Empty Trash
      </Button>
    </DialogActions>
  </Dialog>
);

export default EmptyTrashDialog;
