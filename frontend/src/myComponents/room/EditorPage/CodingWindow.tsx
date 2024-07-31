import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shadcn/components/ui/select";
import { Button } from "../../../shadcn/components/ui/button";
import { GrRedo, GrUndo } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { TbClipboardCopy } from "react-icons/tb";
import { BiSolidDownload } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shadcn/components/ui/dialog";
import { HiArrowUpTray } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";
import { LuMaximize, LuMinimize } from "react-icons/lu";
interface CodingWindowProps {
  historyIndex: number;
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  handleUndo: () => void;
  handleRedo: () => void;
  handleDelete: () => void;
  handleCopy: () => void;
  handleDownload: () => void;
  handleUpload: () => void;
  handleFullscreenToggle: () => void;
  handleMinimize: () => void;
  handleMaximize: () => void;
  handleRunCode: () => void;
  editorRef: React.MutableRefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isUploadDialogOpen: boolean;
  handleReset: () => void;
  setIsUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadError: string;
  dragActive: boolean;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFullscreenToggle: () => void;
  handleFileUpload: (file: File) => void;
  history: string[];
  updateEditorContent: (content: string) => void;
}
const CodingWindow: React.FC<CodingWindowProps> = ({
  historyIndex,
  language,
  setLanguage,
  handleUndo,
  handleRedo,
  handleCopy,
  handleDownload,
  handleUpload,
  handleFullscreenToggle,
  handleRunCode,
  editorRef,
  isLoading,
  isUploadDialogOpen,
  handleReset,
  setIsUploadDialogOpen,
  uploadError,
  dragActive,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  history,
}) => {
return (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-200 dark:bg-gray-700">
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
              <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                Upload Your Code File
              </DialogTitle>
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
              <p className="text-red-500 text-sm mt-4 text-center">
                {uploadError}
              </p>
            )}
            <DialogFooter className="mt-6 flex justify-end space-x-4">
              <Button
                onClick={() => setIsUploadDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
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
            document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen"
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
    <div className="flex-1 overflow-auto p-4 bg-[#282a36]">
      <div ref={editorRef} className="h-full w-full break-words text-sm"></div>
    </div>
  </div>
);

};

export default CodingWindow;
