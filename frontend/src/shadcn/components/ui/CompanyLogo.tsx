import * as React from "react";

interface CompanyLogoProps {
  className?: string;
  // name: string;
}

export default function CompanyLogo({ className }: CompanyLogoProps) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      return document.body.classList.contains("dark");
    }
    return false;
  });

  React.useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.body.classList.contains("dark"));
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex items-center justify-center">
        <img
          src={isDark ? "/1.png" : "/2.png"}
          alt="Company Logo"
          className={`w-22 h-10 ${className}`}
        />
      </div>
    </div>
  );
}