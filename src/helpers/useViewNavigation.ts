import { useState, type Dispatch, type SetStateAction } from "react";
import { selectedView, type SelectedView } from "../utils/selectedView";

interface UseViewNavigationReturn {
  currentView: SelectedView;
  setCurrentView: Dispatch<SetStateAction<SelectedView>>;
  selectedFolderId: string | null;
  setSelectedFolderId: Dispatch<SetStateAction<string | null>>;
  handleViewChange: (view: SelectedView) => void;
  handleFolderSelect: (folderId: string) => void;
}

export const useViewNavigation = (): UseViewNavigationReturn => {
  const [currentView, setCurrentView] = useState<SelectedView>(
    selectedView.NOTES,
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Reset selectedNoteId when leaving scratchpad is handled by caller
  const handleViewChange = (view: SelectedView) => {
    setCurrentView(view);
    // Caller (useMainViewCoordination) will handle selectedNoteId reset
  };

  const handleFolderSelect = (folderId: string) => {
    setCurrentView(selectedView.FOLDERS);
    setSelectedFolderId(folderId);
  };

  return {
    currentView,
    setCurrentView,
    selectedFolderId,
    setSelectedFolderId,
    handleViewChange,
    handleFolderSelect,
  };
};
