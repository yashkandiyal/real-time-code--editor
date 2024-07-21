
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { LuMaximize, LuMinimize } from "react-icons/lu";
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
  javascript: 63, // JavaScript (Node.js 12.14.0)
  cpp: 54, // C++ (GCC 9.2.0)
  python: 71, // Python (3.8.1)
};

const EditorPage: React.FC<EditorPageProps> = () => {
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
              setEditorContent(update.state.doc.toString());
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
          stdin: "", // Add input here if needed
        }),
      };

      const submitResponse = await fetch(url, options);
      const submitData = await submitResponse.json();
      const token = submitData.token;

      let status = "Processing";
      while (status === "Processing" || status === "In Queue") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

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

        const resultData = await resultResponse.json();
        status = resultData.status.description;

        if (status === "Accepted") {
          setOutput(resultData.stdout || resultData.stderr || "No output");
          break;
        }
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Error executing code. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                  <div className="absolute top-full mt-1 w-max p-2 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {document.fullscreenElement
                      ? "Exit fullscreen"
                      : "Enter fullscreen"}
                  </div>
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
      
    </div>
  );
};

export default EditorPage;
