import * as React from "react";
import { GoMoon } from "react-icons/go";
import { TiWeatherSunny } from "react-icons/ti";
import { cn } from "../../lib/utils";

const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      return document.body.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const newTheme = document.body.classList.contains("dark");
    setIsDark(newTheme);
    window.dispatchEvent(new Event("themeChange"));
  };

  return (
    <button
      ref={ref}
      aria-label="Toggle Theme"
      className={cn(
        "relative inline-flex items-center justify-center w-16 h-8 p-1 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300",
        className
      )}
      onClick={toggleTheme}
      {...props}
    >
      <span
        className={cn(
          "absolute left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center transition-transform duration-300",
          isDark ? "translate-x-8" : "translate-x-0"
        )}
      >
        {isDark ? (
          <GoMoon className="w-4 h-4 text-yellow-500" />
        ) : (
          <TiWeatherSunny className="w-4 h-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
});

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
