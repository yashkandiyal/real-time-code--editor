import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { ToggleButton } from "../../shadcn/components/ui/ToggleButton.tsx";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar() {
  const { user } = useUser();
  const username = user ? user.firstName : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          <CompanyLogo />
        </div>
        
        {/* Center section - Desktop only */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          <a href="#docs" className="hover:text-indigo-600">Docs</a>
          <a href="#changelog" className="hover:text-indigo-600">Changelog</a>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ToggleButton />
            {username ? (
              <UserButton />
            ) : (
              <a href="/login" className="hover:text-indigo-600">Login</a>
            )}
            <a href="#become-a-collaborator" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-300">
              Become a Collaborator →
            </a>
          </div>

          {/* Hamburger Menu Button - Mobile only */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 dark:text-white">
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <a href="#pricing" className="block py-2 hover:text-indigo-600">Pricing</a>
          <a href="#docs" className="block py-2 hover:text-indigo-600">Docs</a>
          <a href="#changelog" className="block py-2 hover:text-indigo-600">Changelog</a>
          <div className="py-2">
            <ToggleButton />
          </div>
          {username ? (
            <div className="py-2">
              <UserButton />
            </div>
          ) : (
            <a href="/login" className="block py-2 hover:text-indigo-600">Login</a>
          )}
          <a href="#become-a-collaborator" className="block py-2 bg-gray-200 text-gray-800 px-4 rounded-full text-sm hover:bg-gray-300 mt-2">
            Become a Collaborator →
          </a>
        </div>
      )}
    </nav>
  );
}