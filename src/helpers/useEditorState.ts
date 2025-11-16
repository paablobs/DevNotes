import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { selectedView, type SelectedView } from "../utils/selectedView";

interface Note {
  id: string;
  text: string;
  category: string;
  isFav: boolean;
  isTrash: boolean;
  folderId?: string;
}

interface UseEditorStateReturn {
  textAreaValue: string;
  handleEditorChange: (value: string) => void;
}

export const useEditorState = (
  currentView: SelectedView,
  selectedNoteId: string | null,
  notes: Note[],
): UseEditorStateReturn => {
  const [scratchpadValue, setScratchpadValue] = useLocalStorage<string>(
    "scratchpad",
    "Welcome to DevNotes!\n\nThis is your scratchpad. You can write down quick notes here that won't be saved permanently.\n\nFeel free to type anything you want, and it will be saved automatically as you type.",
  );
  const [textAreaValue, setTextAreaValue] = useState("");

  const getSelectedNote = () =>
    notes.find((n) => n.id === selectedNoteId) || null;

  const getTextAreaValue = () => {
    if (currentView === selectedView.SCRATCHPAD) return scratchpadValue;
    const note = getSelectedNote();
    return note ? note.text : "";
  };

  // Sync textAreaValue when view or note changes
  useEffect(() => {
    setTextAreaValue(getTextAreaValue());
  }, [currentView, selectedNoteId, notes, scratchpadValue]);

  const handleEditorChange = (value: string) => {
    setTextAreaValue(value);
    if (currentView === selectedView.SCRATCHPAD) {
      setScratchpadValue(value);
    }
    // Note updates are handled by caller with setNotes
  };

  return {
    textAreaValue,
    handleEditorChange,
  };
};
