"use client";
import React, { useCallback } from "react";
import { EditorState, convertToRaw } from "draft-js";
import dynamic from "next/dynamic";
import draftToHtml from "draftjs-to-html";
import { cn } from "@/lib/utils";

// Cargamos el editor de manera dinámica, sin renderizar en el servidor.
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface PropsType {
  placeholder: string;
  wrapperClassName?: string;
  editorClassName?: string;
  onChange: (html: string) => void;
  editorState?: EditorState; // Se reemplaza any por EditorState
  setEditorState?: (state: EditorState) => void; // Se reemplaza any por EditorState
}

const DraftEditor: React.FC<PropsType> = ({
  placeholder,
  editorClassName,
  wrapperClassName,
  onChange,
  editorState,
  setEditorState,
}) => {
  const onEditorStateChange = useCallback(
    (state: EditorState) => { // Se reemplaza any por EditorState
      setEditorState?.(state);
      const contentState = state.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const html = draftToHtml(rawContent);
      onChange?.(html);
    },
    [onChange, setEditorState] // Se agregan las dependencias que se usan dentro del callback.
  );

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder}
      wrapperClassName={cn("wrapper-class border border-input", wrapperClassName)}
      editorClassName={cn("editor-class", editorClassName)}
      toolbar={{
        options: ["inline", "blockType", "list", "link", "emoji", "image"],
        inline: {
          options: ["bold", "italic", "underline", "strikethrough"],
        },
        blockType: {
          options: ["Normal", "H1", "H2", "H3", "Blockquote"],
        },
        list: {
          options: ["unordered", "ordered"],
        },
      }}
    />
  );
};

export default DraftEditor;
