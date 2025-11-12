import { useMemo, useEffect } from "react";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";

import { ColorHighlighter } from "./ColorHighlighter/ColorHighlighter";
import { SmilieReplacer } from "./SmilieReplacer/SmilieReplacer";
import styles from "./TipTap.module.scss";

interface TiptapProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

const Tiptap = ({ content, onChange, editable = true }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Text,
      Highlight,
      Typography,
      ColorHighlighter,
      SmilieReplacer,
    ],
    content: content ?? "",
    editable,
    autofocus: true,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== undefined && content !== current) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  );
};

export default Tiptap;
