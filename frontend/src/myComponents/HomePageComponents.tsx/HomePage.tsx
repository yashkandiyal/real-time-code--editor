import Navbar from "../Navbar/Navbar";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import ExistingRoomPageModal from "./ExistingRoomPageModal";
import NewRoomPageModal from "./NewRoomPageModal";
import { useUser } from "@clerk/clerk-react";

export default function HomePage() {
  const { user } = useUser();
  const isUserLoggedIn = user ? true : false;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
      <Navbar />
      <main className="flex justify-center items-center h-screen">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col justify-center items-center max-w-full">
            <div className="flex items-center mb-4 space-x-2 flex-wrap justify-center">
              <h1 className="text-2xl md:text-5xl font-bold whitespace-nowrap text-center">
                WELCOME to the
              </h1>
              <div className="flex-shrink-0">
                <CompanyLogo className="h-16 md:h-24" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold whitespace-nowrap text-center">
                Community
              </h1>
            </div>
            <p className="text-lg md:text-xl text-center mt:5">
              Create a live room & connect with multiple collaborators to code
              live.
            </p>
          </div>
          {/* Right Side of the panel */}
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md mb-4">
              <h2 className="text-2xl font-semibold mb-4">
                Start an Instant room to collaborate and code now
              </h2>
            </div>
            <div className="flex gap-4">
              <NewRoomPageModal isUserLoggedIn={isUserLoggedIn} />
              <ExistingRoomPageModal isUserLoggedIn={isUserLoggedIn} />
            </div>
          </div>
        </div>
      </main>
         
    </div>
  );
}
