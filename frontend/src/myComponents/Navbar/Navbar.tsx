import { useRef } from "react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "../../shadcn/components/ui/button";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import { useUser } from "@clerk/clerk-react";
export default function Navbar() {
  
  const username=useRef<string|null>(null);
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
  const { user } = useUser();
  if (user) {
    username.current = user.firstName;
  } else {
    username.current = null;
  }

  return (
    <div className="bg-white   dark:bg-gray-800 text-gray-800 dark:text-white border-2 dark:border-gray-900 rounded-xl mx-auto w-fit">
      <header className="bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-4 rounded-lg w-full">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <CompanyLogo />
            {username.current && (
              <div className="font-medium">{username.current}</div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleDarkMode}
            >
              <SunIcon className="h-5 w-5" />
              <span className="sr-only">Toggle light/dark mode</span>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
    </div>
  );
}

function SunIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
