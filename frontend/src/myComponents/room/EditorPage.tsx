import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { GrUndo, GrRedo } from "react-icons/gr";
import { MdClear } from "react-icons/md";
import { TbClipboardCopy } from "react-icons/tb";
import { BiSolidDownload } from "react-icons/bi";
import ConfirmationModal from "../room/MinorComponents/ConfirmationModal";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";

interface EditorPageProps {
  onFullscreenToggle: () => void;
}

const languageIds: { [key: string]: number } = {
  javascript: 63,
  cpp: 54,
  python: 71,
};

const fileExtensions: { [key: string]: string } = {
  javascript: "js",
  cpp: "cpp",
  python: "py",
};

const EditorPage: React.FC<EditorPageProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenAction, setFullscreenAction] = useState<"enter" | "exit">("enter");
  const [showAlert, setShowAlert] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (editorRef.current) {
      const languageExtension = {
        javascript: javascript(),
        cpp: cpp(),
        python: python(),
      }[language] ?? basicSetup;

      const startState = EditorState.create({
        doc: editorContent,
        extensions: [
          basicSetup,
          languageExtension,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setEditorContent(newContent);
              setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newContent]);
              setHistoryIndex(prevIndex => prevIndex + 1);
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      return () => view.destroy();
    }
  }, [editorRef, language]);

  const handleFullscreenToggle = () => {
    if (document.fullscreenElement) {
      setFullscreenAction("exit");
    } else {
      setFullscreenAction("enter");
    }
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (fullscreenAction === "enter") {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error("Failed to enter fullscreen:", err));
    } else {
      document
        .exitFullscreen()
        .catch((err) => console.error("Failed to exit fullscreen:", err));
    }
    setIsModalOpen(false);
    setShowAlert(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const url = "https://judge0-ce.p.rapidapi.com/submissions";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": "6027331747msh65aa3864a9cf1cep1efc50jsn6fcc1a7c5249",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: languageIds[language],
          source_code: editorContent,
          stdin: "",
        }),
      };

      const submitResponse = await fetch(url, options);
      if (!submitResponse.ok) {
        throw new Error(`Submit request failed: ${submitResponse.statusText}`);
      }

      const submitData = await submitResponse.json();
      const token = submitData.token;

      let status = "Processing";
      while (status === "Processing" || status === "In Queue") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": "6027331747msh65aa3864a9cf1cep1efc50jsn6fcc1a7c5249",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        if (!resultResponse.ok) {
          throw new Error(`Result request failed: ${resultResponse.statusText}`);
        }

        const resultData = await resultResponse.json();
        status = resultData.status.description;

        if (status === "Accepted") {
          setOutput(resultData.stdout || resultData.stderr || "No output");
          break;
        } else if (status !== "Processing" && status !== "In Queue") {
          setOutput(resultData.stderr || "Unknown error occurred");
          break;
        }
      }
    } catch (error: any) {
      console.error("Error executing code:", error);
      setOutput(`Error executing code: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      const previousContent = history[historyIndex - 1];
      setEditorContent(previousContent);
      updateEditorContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      const nextContent = history[historyIndex + 1];
      setEditorContent(nextContent);
      updateEditorContent(nextContent);
    }
  };

  const handleReset = () => {
    setEditorContent("");
    setOutput(null);
    setHistory([""]);
    setHistoryIndex(0);
    updateEditorContent("");
  };

  const updateEditorContent = (content: string) => {
    if (editorRef.current) {
      const view = EditorView.findFromDOM(editorRef.current);
      if (view) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: content }
        });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editorContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${fileExtensions[language]}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex border-r border-muted p-6 gap-4">
        <div className="h-full flex-1 rounded-lg border border-muted bg-white dark:bg-gray-800 shadow-md">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-muted px-4 py-2 bg-gray-200 dark:bg-gray-700">
              <div className="text-sm font-medium">Code Editor</div>
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  aria-label="Undo"
                  className="relative group"
                  disabled={historyIndex === 0}
                >
                  <GrUndo className="h-4 w-4" />
                  <span className="sr-only">Undo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  aria-label="Redo"
                  className="relative group"
                  disabled={historyIndex === history.length - 1}
                >
                  <GrRedo className="h-4 w-4" />
                  <span className="sr-only">Redo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  aria-label="Reset"
                  className="relative group"
                >
                  <MdClear className="h-4 w-4" />
                  <span className="sr-only">Reset</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copy"
                  className="relative group"
                >
                  <TbClipboardCopy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  aria-label="Download"
                  className="relative group"
                >
                  <BiSolidDownload className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreenToggle}
                  aria-label={
                    document.fullscreenElement
                      ? "Exit fullscreen"
                      : "Enter fullscreen"
                  }
                  className="relative group"
                >
                  {document.fullscreenElement ? (
                    <LuMinimize className="h-4 w-4" />
                  ) : (
                    <LuMaximize className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {document.fullscreenElement
                      ? "Exit fullscreen"
                      : "Enter fullscreen"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRunCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Running..." : "Run"}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div
                ref={editorRef}
                className="h-full w-full rounded-md border border-muted bg-gray-100 dark:bg-gray-900 p-4 text-sm"
              ></div>
            </div>
          </div>
        </div>
        {output && (
          <div className="h-full w-[20%] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-lg overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            <pre className="text-sm whitespace-pre-wrap break-all">{output}</pre>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        action={fullscreenAction}
      />
      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default EditorPage;
