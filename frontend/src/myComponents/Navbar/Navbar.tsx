import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "../../shadcn/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../../shadcn/components/ui/sheet";
import { ToggleButton } from "../../shadcn/components/ui/ToggleButton";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import {
  FiBook,
  FiDollarSign,
  FiMenu,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="text-base font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {children}
  </Link>
);

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, children }) => (
  <SheetClose asChild>
    <Link
      to={to}
      className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-400 transition-colors"
    >
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  </SheetClose>
);

const Navbar = () => {
  const { user } = useUser();
  const username = user?.firstName || null;

  return (
    <nav className=" w-full bg-white dark:bg-gray-900 border-b  dark:border-gray-800 shadow-sm">
      <div className="container px-4 lg:px-8">
        <div className="flex items-center justify-between  h-14">
          {/* Left section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <CompanyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Center section - Desktop only */}
          <div className="hidden md:flex items-center px-4 pr-24 space-x-1">
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/changelog">Changelog</NavLink>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ToggleButton />
              {username ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/login" className="text-sm font-medium">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center justify-end">
              <ToggleButton />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative ml-2">
                    <FiMenu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-sm p-0 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900 text-gray-800 dark:text-white"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <CompanyLogo className="h-8 w-auto" />
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon"></Button>
                        </SheetClose>
                      </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-6 px-4">
                      <div className="space-y-1">
                        <NavItem to="/pricing" icon={FiDollarSign}>
                          Pricing
                        </NavItem>
                        <NavItem to="/docs" icon={FiBook}>
                          Docs
                        </NavItem>
                        <NavItem to="/changelog" icon={FiRefreshCw}>
                          Changelog
                        </NavItem>
                      </div>
                    </nav>
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                      {username ? (
                        <div className="flex items-center space-x-3">
                          <UserButton afterSignOutUrl="/" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {username}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              Manage Account
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Button asChild variant="default" className="w-full">
                          <Link
                            to="/login"
                            className="flex items-center justify-center"
                          >
                            <FiUser className="mr-2 h-4 w-4" />
                            Sign In
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
