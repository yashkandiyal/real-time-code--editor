import React, { useState, useEffect } from 'react';
import { Button } from '../../shadcn/components/ui/button';
import { Textarea } from '../../shadcn/components/ui/textarea';
import { LuMaximize, LuMinimize } from 'react-icons/lu';
import ConfirmationModal from '../room/MinorComponents/ConfirmationModal'; 
import Alert from '../../shadcn/components/ui/Alert'; 
// import {ToggleButton} from '../../shadcn/components/ui/ToggleButton';
interface EditorPageProps {
  onFullscreenToggle: () => void; 
}

const EditorPage: React.FC<EditorPageProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenAction, setFullscreenAction] = useState<'enter' | 'exit'>('enter');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleFullscreenToggle = () => {
    if (document.fullscreenElement) {
      setFullscreenAction('exit');
    } else {
      setFullscreenAction('enter');
    }
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (fullscreenAction === 'enter') {
      document.documentElement.requestFullscreen().catch((err) => console.error('Failed to enter fullscreen:', err));
    } else {
      document.exitFullscreen().catch((err) => console.error('Failed to exit fullscreen:', err));
    }
    setIsModalOpen(false);
    setShowAlert(true); // Show alert after fullscreen action
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 border-r border-muted p-6">
        <div className="h-full w-full rounded-lg border border-muted">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-muted px-4 py-2">
              <div className="text-sm font-medium">Code Editor</div>
              <div className="flex items-center gap-2">
                 
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreenToggle} 
                >
                  {document.fullscreenElement ? (
                    <LuMinimize className="h-4 w-4" />
                  ) : (
                    <LuMaximize className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle Fullscreen</span>
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        action={fullscreenAction}
      />
      <Alert
        isOpen={showAlert}
        onConfirm={() => {}} 
        onCancel={() => setShowAlert(false)} 
        action={fullscreenAction}
      />
    </div>
  );
};

export default EditorPage;
