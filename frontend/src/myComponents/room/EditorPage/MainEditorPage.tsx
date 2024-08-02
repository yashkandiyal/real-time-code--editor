//@ts-nocheck
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from "react";
import { Button } from "../../../shadcn/components/ui/button";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { GrUndo, GrRedo } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { TbClipboardCopy } from "react-icons/tb";
import { BiSolidDownload } from "react-icons/bi";
import { HiArrowUpTray } from "react-icons/hi2";
import ConfirmationModal from "../MinorComponents/ConfirmationModal";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { FiUploadCloud } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shadcn/components/ui/select";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../shadcn/components/ui/resizable";
import { Alert, AlertDescription } from "../../../shadcn/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../shadcn/components/ui/dialog";
import socketService from "../../../services/SocketService";
import { debounce } from "lodash";
import "@uiw/codemirror-theme-dracula";
import CodingWindow from "./CodingWindow";
import OutputWindow from "./OutputWindow";

interface EditorPageProps {
  onFullscreenToggle: () => void;
  className?: string;
  username: string;
  roomId: string;
  isAuthor: boolean;
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

const EditorPage: React.FC<EditorPageProps> = ({
  username,
  roomId,
  isAuthor,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenAction, setFullscreenAction] = useState<"enter" | "exit">(
    "enter"
  );
  const [showAlert, setShowAlert] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  const debouncedEmitChange = useCallback(
    debounce((content: string, roomId: string, username: string) => {
      socketService.emit("codeChange", { content, roomId, username });
    }, 10),
    []
  );
  useEffect(() => {
    const Theme = document.body.classList.contains("dark") ? "dark" : "light";
    setCurrentTheme(Theme);
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (!username) {
      socketService.connect(username, isAuthor);
    }
  }, [isAuthor, username]);

  useEffect(() => {
    if (editorRef.current) {
      const languageExtension =
        {
          javascript: javascript(),
          cpp: cpp(),
          python: python(),
        }[language] ?? basicSetup;

      const startState = EditorState.create({
        doc: editorContent,
        extensions: [
          basicSetup,
          languageExtension,
          EditorView.lineWrapping,
          EditorView.editable.of(true),
          EditorView.contentAttributes.of({ spellcheck: "false" }),
          EditorView.theme({
            "&": {
              backgroundColor: "#282a36", // Background color of the editor
              color: "#f8f8f2", // Default text color
              fontFamily: "Consolas, 'Courier New', monospace",
              fontSize: "16px",
              lineHeight: "1.6",
            },
            ".cm-content": {
              caretColor: "#f8f8f2", // Cursor color
            },
            ".cm-gutters": {
              backgroundColor: "#282a36", // Gutters background color
              color: "#6272a4", // Line numbers color
              border: "none",
            },
            ".cm-lineNumbers .cm-gutterElement": {
              color: "#6D8A88", // Line numbers color
            },
            ".cm-activeLine": {
              backgroundColor: "rgba(255,255,255,0.1)", // Active line highlight color
            },
            ".cm-activeLineGutter": {
              backgroundColor: "rgba(255,255,255,0.1)", // Active line gutter highlight color
            },
            ".cm-selectionBackground": {
              backgroundColor: "rgba(255, 255, 255, 0.10)", // Selection background color
            },
            ".cm-cursor": {
              borderLeft: "2px solid #f8f8f2", // Cursor color
            },
            ".cm-matchingBracket": {
              backgroundColor: "rgba(255, 255, 255, 0.10)",
              outline: "1px solid #50fa7b", // Matching bracket outline color
            },
            ".cm-keyword": { color: "#ff79c6" }, // Keyword color
            ".cm-operator": { color: "#ff79c6" }, // Operator color
            ".cm-variableName": { color: "#50fa7b" }, // Variable name color
            ".cm-variableName.definition": { color: "#50fa7b" }, // Variable definition color
            ".cm-number": { color: "#bd93f9" }, // Number color
            ".cm-string": { color: "#f1fa8c" }, // String color
            ".cm-comment": { color: "#6272a4" }, // Comment color
            ".cm-propertyName": { color: "#66d9ef" }, // Property name color
            ".cm-function": { color: "#ff79c8" }, // Function color
            ".cm-punctuation": { color: "#f8f8f2" }, // Punctuation color
            ".cm-header": { color: "#ffb86c" }, // Header file color
            ".cm-link": { color: "#8be9fd" }, // Link color
            ".cm-meta": { color: "#f8f8f2" }, // Meta color
            ".cm-tag": { color: "#ff79c6" }, // Tag color
            ".cm-attribute": { color: "#50fa7b" }, // Attribute color
            ".cm-qualifier": { color: "#50fa7b" }, // Qualifier color
            ".cm-builtin": { color: "#50fa7b" }, // Built-in color
            ".cm-type": { color: "#ffb86c" }, // Type color
            ".cm-atom": { color: "#bd93f9" }, // Atom color
            ".cm-variable-2": { color: "#ffffff" }, // Variable-2 color
          }),

          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setEditorContent(newContent);
              setHistory((prevHistory) => [
                ...prevHistory.slice(0, historyIndex + 1),
                newContent,
              ]);
              setHistoryIndex((prevIndex) => prevIndex + 1);
              debouncedEmitChange(newContent, roomId, username);
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      view.focus();
      editorRef.current.view = view;

      return () => view.destroy();
    }
  }, [editorRef, language, username, debouncedEmitChange, currentTheme]);

  useEffect(() => {
    const handleCodeUpdate = ({
      content,
      sender,
    }: {
      content: string;
      sender: string;
    }) => {
      if (
        sender === username ||
        !editorRef.current ||
        !editorRef.current.view
      ) {
        return;
      }

      const view = editorRef.current.view;
      const currentContent = view.state.doc.toString();
      if (currentContent !== content) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: content },
        });
        setEditorContent(content);
        view.focus(); // Maintain focus after update
      }
    };

    socketService.on("codeUpdate", handleCodeUpdate);

    return () => {
      socketService.off("codeUpdate", handleCodeUpdate);
    };
  }, [editorRef, username, editorContent]);

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
      const url = import.meta.env.VITE_RUN_CODE_API;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": import.meta.env.VITE_RUN_CODE_API_KEY,
          "x-rapidapi-host": import.meta.env.VITE_HOST,
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
              "x-rapidapi-key": import.meta.env.VITE_RUN_CODE_API_KEY,
              "x-rapidapi-host": import.meta.env.VITE_HOST,
            },
          }
        );

        if (!resultResponse.ok) {
          throw new Error(
            `Result request failed: ${resultResponse.statusText}`
          );
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
      setHistoryIndex((prevIndex) => prevIndex - 1);
      const previousContent = history[historyIndex - 1];
      setEditorContent(previousContent);
      updateEditorContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
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
          changes: { from: 0, to: view.state.doc.length, insert: content },
        });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(editorContent)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editorContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${language}.${fileExtensions[language]}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        let detectedLanguage = "javascript";

        if (fileExtension === "cpp" || fileExtension === "c") {
          detectedLanguage = "cpp";
        } else if (fileExtension === "py") {
          detectedLanguage = "python";
        }

        setLanguage(detectedLanguage);
        setEditorContent(content);
        updateEditorContent(content);
        setHistory([...history, content]);
        setHistoryIndex(history.length);
        setUploadError(null);
      } else {
        setUploadError("Unable to read the file content.");
      }
    };
    reader.onerror = () => {
      setUploadError("Error reading the file.");
    };
    reader.readAsText(file);
    setIsUploadDialogOpen(false); // Close the dialog after upload
  };

  // Event handler for file selection
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-auto flex-col overflow-hidden  text-gray-900 dark:text-gray-100 p-2">
      <ResizablePanelGroup
        direction="vertical"
        className="flex-1 rounded-lg border"
      >
        <ResizablePanel
          defaultSize={70}
          minSize={40}
          maxSize={80}
          id="menubarDesign"
        >
          <CodingWindow
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            handleReset={handleReset}
            handleCopy={handleCopy}
            handleUpload={handleUpload}
            handleDownload={handleDownload}
            handleFileUpload={handleFileUpload}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            dragActive={dragActive}
            handleRunCode={handleRunCode}
            handleFullscreenToggle={handleFullscreenToggle}
            language={language}
            setLanguage={setLanguage}
            setHistoryIndex={setHistoryIndex}
            historyIndex={historyIndex}
            setHistory={setHistory}
            editorRef={editorRef}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            setIsModalOpen={setIsModalOpen}
            fullscreenAction={fullscreenAction}
            isLoading={isLoading}
            isUploadDialogOpen={isUploadDialogOpen}
            setIsUploadDialogOpen={setIsUploadDialogOpen}
            uploadError={uploadError}
            history={history}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={15} minSize={2} maxSize={100}>
          <OutputWindow output={output} />
        </ResizablePanel>
      </ResizablePanelGroup>
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
