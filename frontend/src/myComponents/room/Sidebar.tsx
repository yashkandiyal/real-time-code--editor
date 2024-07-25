import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../shadcn/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../shadcn/components/ui/sheet";
import { Input } from "../../shadcn/components/ui/input";
import { FaPlus, FaTimes, FaChevronRight, FaUser, FaEnvelope, FaComment, FaCog, FaBars, FaChevronDown, FaPaperPlane } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/components/ui/avatar";

interface ParticipantsProps {
  participants: string[];
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  handleInvite: (email: string) => void;
}

// Participants Component to display each participant
const ParticipantsComponent = ({ username }: { username: string }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg transition-all bg-white shadow">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" alt={`Avatar of ${username}`} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{username}</div>
      </div>
    </div>
  );
};

// Invite Modal Component to handle inviting participants
const InviteModal = ({
  isOpen,
  onClose,
  onInvite,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Submitting email:", email); // Debugging log
      onInvite(email);
      setEmail("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-2"
      >
        <h2 className="text-lg font-semibold mb-4">Invite Participant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// New Comment interface
interface Comment {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

// Updated Comments Component
const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, username: "User1", message: "This is a sample comment", timestamp: new Date() },
    { id: 2, username: "User2", message: "Another comment here", timestamp: new Date() },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        username: "CurrentUser", // Replace with actual logged-in username
        message: newComment.trim(),
        timestamp: new Date(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4 bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{comment.username}</span>
              <span className="text-xs text-gray-500">
                {comment.timestamp.toLocaleString()}
              </span>
            </div>
            <p>{comment.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmitComment} className="p-4 bg-white border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button type="submit" size="icon">
            <FaPaperPlane />
          </Button>
        </div>
      </form>
    </div>
  );
};

// Main Sidebar Component
const Sidebar = ({ participants, isAuthor, handleRemove, handleInvite }: ParticipantsProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const uniqueParticipants = Array.from(new Set(participants));

  const categories = [
    {
      name: "Participants",
      icon: <FaUser />,
      subcategories: uniqueParticipants,
      actions: (username: string) => (
        isAuthor && uniqueParticipants.indexOf(username) !== 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(username)}
            className="ml-2 p-2 rounded-full focus:outline-none focus:ring-2"
          >
            <FaTimes className="h-5 w-5" />
            <span className="sr-only">Remove</span>
          </Button>
        )
      )
    },
    {
      name: "Invite",
      icon: <FaPlus />,
      subcategories: [], 
      actions: () => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)} 
          className="ml-2 p-2 rounded-full focus:outline-none focus:ring-2"
        >
          <FaPlus className="h-5 w-5" />
          <span className="sr-only">Invite participant</span>
        </Button>
      )
    },
    {
      name: "Requests",
      icon: <FaEnvelope />,
      subcategories: [], 
    },
    {
      name: "Comments",
      icon: <FaComment />,
      subcategories: [],
      actions: () => (
        <Sheet open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommentsOpen(true)}
              className="ml-2 p-2 rounded-full focus:outline-none focus:ring-2"
            >
              <FaComment className="h-5 w-5" />
              <span className="sr-only">Open comments</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle>Comments</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCommentsOpen(false)}
                className="absolute top-4 right-4"
              >
                <FaTimes className="h-5 w-5" />
                <span className="sr-only">Close comments</span>
              </Button>
            </SheetHeader>
            <div className="flex-grow overflow-hidden">
              <Comments />
            </div>
          </SheetContent>
        </Sheet>
      )
    },
    {
      name: "Settings",
      icon: <FaCog />,
      subcategories: [], 
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="relative h-screen flex">
      <motion.div
        initial={{ width: isSidebarOpen ? 256 : 64 }}
        animate={{ width: isSidebarOpen ? 256 : 64 }}
        className="h-full bg-gray-100 text-gray-800 overflow-hidden transition-all duration-300 shadow-lg"
      >
        <button
          className="absolute top-4 right-4 z-20 p-2 bg-gray-800 text-white rounded-full focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="h-full p-4 flex flex-col justify-between">
          <div>
            {categories.map((category) => (
              <div key={category.name} className="mb-2">
                <button
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-200 rounded"
                  onClick={() => {
                    if (category.name === "Invite") {
                      setIsModalOpen(true);
                    } else if (category.name === "Comments") {
                      setIsCommentsOpen(true);
                    } else {
                      toggleCategory(category.name);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {category.icon}
                    {isSidebarOpen && <span className="ml-2">{category.name}</span>}
                  </div>
                  {isSidebarOpen && category.subcategories.length > 0 && (expandedCategory === category.name ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                <AnimatePresence>
                  {isSidebarOpen && expandedCategory === category.name && category.name !== "Invite" && category.name !== "Comments" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 mt-1"
                    >
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="py-1 px-2 hover:bg-gray-200 rounded text-sm flex justify-between items-center">
                          <span>{subcategory}</span>
                          {category.actions && category.actions(subcategory)}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={(email) => {
          console.log("Inviting email:", email);
          handleInvite(email);
          setIsModalOpen(false);
        }}
      />

      <Sheet open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Comments</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommentsOpen(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes className="h-5 w-5" />
              <span className="sr-only">Close comments</span>
            </Button>
          </SheetHeader>
          <div className="flex-grow overflow-hidden">
            <Comments />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;