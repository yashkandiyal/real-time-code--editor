import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "../../lib/utils";
import { useState, ReactNode } from "react";

interface CollapsibleProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Collapsible = ({ children, ...props }: CollapsibleProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  return (
    <CollapsiblePrimitive.Root
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </CollapsiblePrimitive.Root>
  );
};

interface CollapsibleTriggerProps {
  children: ReactNode;
  [key: string]: any;
}

const CollapsibleTrigger = ({ children, ...props }: CollapsibleTriggerProps) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger {...props}>
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
};

interface CollapsibleContentProps {
  children: ReactNode;
  open?: boolean;
  [key: string]: any;
}

const CollapsibleContent = ({ children, ...props }: CollapsibleContentProps) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden",
        {
          "max-h-0": !props.open,
          "max-h-screen": props.open,
        }
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
