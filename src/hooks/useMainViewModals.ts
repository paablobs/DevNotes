import { useState, type FormEvent } from "react";

export interface MVFolder {
  id: string;
  name: string;
  color?: string;
}

export const useMainViewModals = () => {
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<MVFolder | null>(null);

  const [emptyTrashOpen, setEmptyTrashOpen] = useState(false);

  const openAddFolder = () => setAddFolderOpen(true);
  const closeAddFolder = () => {
    setAddFolderOpen(false);
    setFolderName("");
  };

  const submitAddFolder = (e?: FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const name = folderName.trim();
    if (!name) {
      closeAddFolder();
      return null;
    }
    setFolderName("");
    setAddFolderOpen(false);
    return name;
  };

  const openDeleteDialogWith = (folder: MVFolder) => {
    setFolderToDelete(folder);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFolderToDelete(null);
  };
  const confirmDeleteFolder = () => {
    const id = folderToDelete?.id ?? null;
    closeDeleteDialog();
    return id;
  };

  const openEmptyTrash = () => setEmptyTrashOpen(true);
  const closeEmptyTrash = () => setEmptyTrashOpen(false);
  const confirmEmptyTrash = () => {
    closeEmptyTrash();
    return true;
  };

  return {
    addFolderOpen,
    openAddFolder,
    closeAddFolder,
    folderName,
    setFolderName,
    submitAddFolder,
    deleteDialogOpen,
    folderToDelete,
    openDeleteDialogWith,
    closeDeleteDialog,
    confirmDeleteFolder,
    emptyTrashOpen,
    openEmptyTrash,
    closeEmptyTrash,
    confirmEmptyTrash,
  };
};

export default useMainViewModals;
