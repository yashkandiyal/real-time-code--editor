  import React, { useState, useEffect, useRef, ChangeEvent,} from "react";
  import { Button } from "../../shadcn/components/ui/button";
  import { LuMaximize, LuMinimize } from "react-icons/lu";
  import { GrUndo, GrRedo } from "react-icons/gr";
  import { MdDelete } from "react-icons/md";
  import { TbClipboardCopy } from "react-icons/tb";
  import { BiSolidDownload} from "react-icons/bi";
  import { HiArrowUpTray } from "react-icons/hi2";
  import ConfirmationModal from "../room/MinorComponents/ConfirmationModal";
  import { EditorView, basicSetup } from "codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { EditorState } from "@codemirror/state";
  import { FiUploadCloud } from 'react-icons/fi';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../shadcn/components/ui/select";
  import { cpp } from "@codemirror/lang-cpp";
  import { python } from "@codemirror/lang-python";
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "../../shadcn/components/ui/resizable";
  // import { Alert, AlertDescription } from "../../shadcn/components/ui/alert";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "../../shadcn/components/ui/dialog";

  interface EditorPageProps {
    onFullscreenToggle: () => void;
    className?: string;
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
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);


    useEffect(() => {
      if (showAlert) {
        const timer = setTimeout(() => setShowAlert(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [showAlert]);

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
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newContent = update.state.doc.toString();
                setEditorContent(newContent);
                setHistory((prevHistory) => [
                  ...prevHistory.slice(0, historyIndex + 1),
                  newContent,
                ]);
                setHistoryIndex((prevIndex) => prevIndex + 1);
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
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          let detectedLanguage = 'javascript';
    
          if (fileExtension === 'cpp' || fileExtension === 'c') {
            detectedLanguage = 'cpp';
          } else if (fileExtension === 'py') {
            detectedLanguage = 'python';
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
          <ResizablePanel defaultSize={70} minSize={40} maxSize={70} id="menubarDesign">
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
                    <MdDelete className="h-4 w-4" />
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
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Upload">
                        <HiArrowUpTray className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-opacity-20 backdrop-blur-sm p-6 max-w-md mx-auto">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-bold text-center text-gray-800">Upload Your Code File</DialogTitle>
                    </DialogHeader>
                    <div
                      className={`flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed rounded-lg transition-colors duration-300 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept=".js,.cpp,.c,.py"
                        onChange={handleUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-center p-4 w-full flex flex-col items-center"
                      >
                        <FiUploadCloud className="w-12 h-12 mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 font-medium">
                          Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: .js, .cpp, .c, .py
                        </p>
                      </label>
                    </div>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-4 text-center">{uploadError}</p>
                    )}
                    <DialogFooter className="mt-6 flex justify-end space-x-4">
                      <Button
                        onClick={() => setIsUploadDialogOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        // onClick={handleUpload}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                      >
                        Upload
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                  </Dialog>
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
          </ResizablePanel>
          
          <ResizableHandle>
            <div className="flex items-center justify-center h-4 w-full bg-blue-500 hover:bg-blue-600 cursor-row-resize transition-all duration-200">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </ResizableHandle>

          <ResizablePanel defaultSize={20} minSize={5} maxSize={100}>
            <div className="h-full w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-lg overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Output</h3>
              <pre className="text-sm whitespace-pre-wrap break-all">
                {output}
              </pre>
            </div>
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