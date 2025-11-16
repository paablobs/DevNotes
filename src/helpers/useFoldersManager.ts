import { useState, type ChangeEvent, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { storageKeys } from "../utils/storageKeys";
import {
  yellow,
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
} from "@mui/material/colors";

interface Folder {
  id: string;
  name: string;
  color?: string;
}

type ColorShades = { [shade: string]: string };

const colorPalette: ColorShades[] = [
  yellow,
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
];

const randomColor = (): string => {
  const colObj = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const preferredShades = [500, 600, 400, 700, 300, 200, 50];
  for (const s of preferredShades) {
    const key = String(s);
    if (colObj[key]) return colObj[key];
  }
  const vals = Object.values(colObj);
  return typeof vals[0] === "string" ? vals[0] : "#FFC107";
};

interface UseFoldersManagerReturn {
  folders: Folder[];
  setFolders: (value: Folder[] | ((prev: Folder[]) => Folder[])) => void;
  open: boolean;
  folderName: string;
  openDeleteDialog: boolean;
  folderToDelete: Folder | null;
  handleClickOpen: () => void;
  handleClose: () => void;
  handleFolderNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddFolder: (event: FormEvent<HTMLFormElement>) => void;
  handleOpenDeleteDialog: (folder: Folder) => void;
  handleCloseDeleteDialog: () => void;
  handleConfirmDeleteFolder: () => void;
  handleDeleteFolder: (id: string) => void;
}

export const useFoldersManager = (): UseFoldersManagerReturn => {
  const [folders, setFolders] = useLocalStorage<Folder[]>(
    storageKeys.FOLDERS,
    [],
  );
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<null | Folder>(null);

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
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName.trim(),
        color: randomColor(),
      };
      setFolders([newFolder, ...folders]);
      setFolderName("");
    }
    handleClose();
  };

  const handleOpenDeleteDialog = (folder: Folder) => {
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

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  return {
    folders,
    setFolders,
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
    handleDeleteFolder,
  };
};
