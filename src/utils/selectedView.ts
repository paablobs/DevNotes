export const selectedView = {
  SCRATCHPAD: "scratchpad",
  NOTES: "notes",
  FAVORITES: "favorites",
  TRASH: "trash",
  FOLDERS: "folders",
};

export type SelectedView = (typeof selectedView)[keyof typeof selectedView];
