import React, { useState, useCallback } from 'react';
import { Button } from './button';
import { LuChevronDown } from 'react-icons/lu';

interface DropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  icon: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onSelect, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (option: string) => {
      onSelect(option);
      setIsOpen(false);
    },
    [onSelect]
  );

  return (
    <div className="relative inline-block text-left">
      <Button
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 border rounded-md cursor-pointer dark:bg-gray-800 dark:text-gray-100"
      >
        {icon}
        <span>{selectedOption}</span>
        <LuChevronDown className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-max rounded-md border bg-white dark:bg-gray-800 shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
