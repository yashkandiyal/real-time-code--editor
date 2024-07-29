import React from "react";
interface OutputWindowProps {
  output: string;
}
const OutputWindow: React.FC<OutputWindowProps> = ({ output }) => {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-lg overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Output</h3>
      <pre className="text-sm whitespace-pre-wrap break-all">{output}</pre>
    </div>
  );
};

export default OutputWindow;
