// import React from "react";
// import Codemirror from "codemirror";
import { Button } from "../../shadcn/components/ui/button";
import { Textarea } from "../../shadcn/components/ui/textarea";
import { LuMaximize, LuMinimize } from "react-icons/lu";
const EditorPage = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 border-r border-muted p-6">
        <div className="h-full w-full rounded-lg border border-muted">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-muted px-4 py-2">
              <div className="text-sm font-medium">Code Editor</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <LuMaximize className="h-4 w-4" />
                  <span className="sr-only">Maximize</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <LuMinimize className="h-4 w-4" />
                  <span className="sr-only">Minimize</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                >
                  <span className="sr-only">Toggle participants menu</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Textarea
                className="h-full w-full resize-none rounded-md border border-muted bg-background p-4 text-sm"
                placeholder="Start typing your code..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
