"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { Canvas } from "fabric";
import { CardVariantEnum } from "@/components/Editor/Editor";

interface EditorContextProps {
  editor: FabricJSEditor;
  onReady: (canvas: Canvas) => void;
  saveCanvasState: (index: number, variant: CardVariantEnum) => void;
  removeCanvasState: (index: number) => void;
  loadCanvasState: () => any;
  isCanvasInitialized: () => boolean;
  localStorageSave: (newState?: any) => void;
  resetEditor: () => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editor, setEditor] = useState<FabricJSEditor | null>(null);
  const [savedState, setSavedState] = useState<{ json: string; svg: string; objects: any; variant: CardVariantEnum }[]>(localStorage.getItem("canvasState") ? JSON.parse(localStorage.getItem("canvasState")!) : []);

  const onReady = (canvas: Canvas) => {
    const fabricEditor: any = { canvas };
    setEditor(fabricEditor);
  };

  const saveCanvasState = (index: number, variant: CardVariantEnum) => {
    if (editor?.canvas) {
      const json = editor.canvas.toJSON();
      const svg = editor.canvas.toSVG();
      const objects = editor.canvas.getObjects();
      setSavedState(prev => {
        const copy = [...prev];
        copy[index] = { json, svg, objects, variant };
        return copy;
      });
    }
  };

  const removeCanvasState = (index: number) => {
    if (editor?.canvas) {
      setSavedState(prev => prev.filter((_, i) => i !== index));
    }
  }

  const resetEditor = () => {
    setSavedState([])
  }

  const loadCanvasState = () => {
    return savedState;
  };

  const localStorageSave = (newState: any) => {
    localStorage.setItem("canvasState", JSON.stringify(newState || savedState));
  }

  const isCanvasInitialized = () => {
    return savedState.length > 0;
  }

  return (
    <EditorContext.Provider value={{ editor: editor as FabricJSEditor, onReady, saveCanvasState, loadCanvasState, isCanvasInitialized, localStorageSave, resetEditor, removeCanvasState }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};