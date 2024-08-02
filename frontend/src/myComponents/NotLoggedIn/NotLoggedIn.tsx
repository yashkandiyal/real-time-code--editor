import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../shadcn/components/ui/button";
import socketService from "../../services/SocketService";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../shadcn/components/ui/card";
import { motion } from "framer-motion";
import {
  LuLoader2 as Loader2,
  LuAlertCircle as AlertCircle,
  LuHome as Home,
  LuLogIn as LogIn,
} from "react-icons/lu";
import UsernameModal from "./UsernameModal";

const NotLoggedIn = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomExists, setRoomExists] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const userEmailAddress = user?.emailAddresses?.[0]?.emailAddress || "";

  const [currentLoggedinUsername, setCurrentLoggedinUsername] = useState<
    string | null
  >(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setCurrentLoggedinUsername(user?.fullName || null);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      socketService.connect("", false);
      socketService.once("roomStatus", handleRoomStatus);
      socketService.once("joinBlockedUserError", () => {
        toast.error("You are not allowed to join this room");
      });
      socketService.emit("RoomExists", { roomId });

      return () => {
        socketService.disconnect();
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (roomExists && isSignedIn) {
      socketService.once("blockedStatus", handleBlockedStatus);
      socketService.emit("checkBlockedStatus", {
        roomId,
        email: userEmailAddress,
      });
    }
  }, [roomExists, isSignedIn]);

  const handleBlockedStatus = ({ isBlocked }: { isBlocked: boolean }) => {
    setIsBlocked(isBlocked);
    setLoading(false);
    if (isBlocked) {
      toast.error("You are not allowed to join this room");
    }
  };

  const handleRoomStatus = ({ roomExists }: { roomExists: boolean }) => {
    setRoomExists(roomExists);
    setLoading(false);
    if (!roomExists) {
      toast.error("Room does not exist or the host has ended the meeting.");
    }
  };

  const handleUsernameSubmit = (username: string) => {
    navigate(`/room/${roomId}`, {
      state: { username, authorStatus: false, userEmailAddress },
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderCard = (
    title: string,
    icon: React.ReactNode,
    content: string,
    buttonText?: string,
    buttonIcon?: React.ReactNode,
    onButtonClick?: () => void
  ) => (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
              {icon}
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {content}
            </p>
          </CardContent>
          {buttonText && onButtonClick && (
            <CardFooter className="flex justify-center">
              <Button
                onClick={onButtonClick}
                className="flex items-center gap-2"
              >
                {buttonIcon}
                {buttonText}
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );

  if (loading || !isLoaded) {
    return renderCard(
      "Loading...",
      <Loader2 className="h-6 w-6 animate-spin" />,
      "Please wait while we verify the room and your status..."
    );
  }

  if (roomExists === null) {
    return renderCard(
      "Checking Room",
      <Loader2 className="h-6 w-6 animate-spin" />,
      "Please wait while we verify the room..."
    );
  }

  if (roomExists === false) {
    return renderCard(
      "Room Not Found",
      <AlertCircle className="h-6 w-6 text-red-500" />,
      "The room you are trying to join does not exist or has been ended by the host.",
      "Go to Home",
      <Home className="h-4 w-4" />,
      () => navigate("/")
    );
  }

  if (isBlocked) {
    return renderCard(
      "Access Denied",
      <AlertCircle className="h-6 w-6 text-red-500" />,
      "You are not allowed to join this room.",
      "Go to Home",
      <Home className="h-4 w-4" />,
      () => navigate("/")
    );
  }

  if (!isSignedIn) {
    return renderCard(
      "Access Denied",
      <LogIn className="h-6 w-6 text-blue-500" />,
      "You need to be logged in to access this room.",
      "Go to Sign In",
      <LogIn className="h-4 w-4" />,
      () => navigate("/login")
    );
  }

  return (
    <UsernameModal
      isOpen={true}
      onSubmit={handleUsernameSubmit}
      currentLoggedinUsername={currentLoggedinUsername!}
    />
  );
};

export default NotLoggedIn;
