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
  const darkTheme = EditorView.theme({
    "&": {
      backgroundColor: "#1e1e1e", // Deep dark gray for background
      color: "#e0e0e0", // Light gray for text
    },
    ".cm-content": {
      caretColor: "#e0e0e0", // Light gray for caret
    },
    ".cm-gutters": {
      backgroundColor: "#2c2c2c", // Slightly lighter gray for gutters
      color: "#8c8c8c", // Gray for gutter text
    },
    ".cm-activeLine": {
      backgroundColor: "#333333", // Darker gray for active line
    },
    ".cm-selectionBackground": {
      backgroundColor: "#4a8fd4", // Soft blue for selection background
    },
  });
  const lightTheme = EditorView.theme({
    "&": {
      backgroundColor: "#fafafa", // Very light gray for background
      color: "#333333", // Dark gray for text
    },
    ".cm-content": {
      caretColor: "#333333", // Dark gray for caret
    },
    ".cm-gutters": {
      backgroundColor: "#e0e0e0", // Light gray for gutters
      color: "#757575", // Medium gray for gutter text
    },
    ".cm-activeLine": {
      backgroundColor: "#f5f5f5", // Very light gray for active line
    },
    ".cm-selectionBackground": {
      backgroundColor: "#b3d9ff", // Light blue for selection background
    },
  });

  const debouncedEmitChange = useCallback(
    debounce((content: string, roomId: string, username: string) => {
      socketService.emit("codeChange", { content, roomId, username });
    }, 10),
    []
  );

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
      const theme = document.documentElement.classList.contains("dark")
        ? darkTheme
        : lightTheme;

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
          theme,

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

      // Set focus to the editor
      view.focus();
      editorRef.current.view = view;

      return () => view.destroy();
    }
  }, [editorRef, language, username, debouncedEmitChange]);

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
      const url = "https://judge0-ce.p.rapidapi.com/submissions";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key":
            "6027331747msh65aa3864a9cf1cep1efc50jsn6fcc1a7c5249",
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
              "x-rapidapi-key":
                "6027331747msh65aa3864a9cf1cep1efc50jsn6fcc1a7c5249",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
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
    <div className="flex flex-auto flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
