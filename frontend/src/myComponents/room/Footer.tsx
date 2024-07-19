import React from 'react'
import { Button } from '../../shadcn/components/ui/button';
import { FaMicrophone, FaVideo } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      {" "}
      <div className="border-t border-muted p-4">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Button variant="ghost">
            <FaMicrophone className="h-4 w-4" />
            <span>Mic</span>
          </Button>
          <Button variant="ghost">
            <FaVideo className="h-4 w-4" />
            <span>Video</span>
          </Button>
          <Button variant="destructive">
            <FaMicrophone className="h-4 w-4" />
            <span>Leave Meeting</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}

export default Footer