import React from "react";
import { Button } from "../../shadcn/components/ui/button";
import { FaMicrophone, FaVideo, FaPhoneSlash } from "react-icons/fa";
interface FooterProps {
//leaveroom is a function
  leaveRoom: () => void;
}
const Footer = ({leaveRoom}: FooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-initial"
          >
            <FaMicrophone className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Mic</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-initial"
          >
            <FaVideo className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Video</span>
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1 sm:flex-initial"
            onClick={leaveRoom}
          >
            <FaPhoneSlash className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Leave</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
