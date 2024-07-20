import { Button } from "../../shadcn/components/ui/button";
import { FaMicrophone, FaPlus } from "react-icons/fa";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../shadcn/components/ui/sheet";
import { IoMenuSharp } from "react-icons/io5";
//participants coming from the props is an array

interface Participants {
  participants: string[];
}
interface participantsComponentProps {
  username: string;
}
export const ParticipantsComponent = ({
  username,
}: participantsComponentProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <div className="text-sm">{username}</div>
        </div>
        <Button variant="ghost" size="icon">
          <FaMicrophone className="h-4 w-4" />
          <span className="sr-only">Mute/Unmute</span>
        </Button>
      </div>
    </>
  );
};
const Sidebar = ({ participants }: Participants) => {
  return (
    <div>
      <div className="w-72 border-l border-muted p-6 relative hidden sm:block">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Participants</div>
            <Button variant="ghost" size="icon">
              <FaPlus className="h-4 w-4" />
              <span className="sr-only">Add participant</span>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {participants.map((item: string, index: number) => {
              return (
                <>
                  <div key={index}>
                    <ParticipantsComponent username={item} />
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-accent text-accent-foreground"
            >
              <IoMenuSharp className="h-5 w-5" />
              <span className="sr-only">Toggle participants menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-l border-muted p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Participants</div>
                <Button variant="ghost" size="icon">
                  <FaPlus className="h-4 w-4" />
                  <span className="sr-only">Add participant</span>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">User 1</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <FaMicrophone className="h-4 w-4" />
                    <span className="sr-only">Mute/Unmute</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">User 2</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <FaMicrophone className="h-4 w-4" />
                    <span className="sr-only">Mute/Unmute</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">User 3</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <FaMicrophone className="h-4 w-4" />
                    <span className="sr-only">Mute/Unmute</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Sidebar;
