import { UserButton } from "@clerk/clerk-react";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import { useUser } from "@clerk/clerk-react";
import { ToggleButton } from "../../shadcn/components/ui/ToggleButton.tsx";
export default function Navbar() {
  const { user } = useUser();
  const username = user ? user.firstName : null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md">
      <header className="bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <CompanyLogo />
          </div>

          <div className="flex items-center space-x-4">
            <ToggleButton />
            {username && <div className="font-medium">{username}</div>}
            <UserButton />
          </div>
        </div>
      </header>
    </div>
  );
}
