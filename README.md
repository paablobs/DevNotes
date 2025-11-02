# DevNotes — Offline-first Rich Text Notes

DevNotes is a compact, offline-first note-taking web app built with React, TypeScript and Vite. It combines a lightweight local-first data layer with a polished UI and a rich-text editor (TipTap) so you can create, organize and edit notes with no backend required.

Features

- Rich-text editor (TipTap) with typography and highlight extensions
- Scratchpad for quick ephemeral notes
- Create, rename and delete folders
- Mark notes as favorites
- Trash with restore and Empty Trash
- Per-note HTML storage (TipTap) with safe previews in the note list
- Local persistence via a robust `useLocalStorage` hook (syncs across tabs)

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the dev server with Vite:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

Helpful scripts

- `npm run lint` — run ESLint
- `npm run storybook` — start Storybook for components

Core ideas / architecture

- React + TypeScript + Vite for a fast developer experience
- MUI (Material UI) for consistent UI components
- TipTap for WYSIWYG editing; notes are stored as HTML strings
- `useLocalStorage` provides a React-friendly interface to localStorage with cross-tab update dispatching
