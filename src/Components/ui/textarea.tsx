// ./src/Components/ui/textarea.tsx

import * as React from "react" 
import { cn } from "@/lib/utils";

// ❌ Removed the unnecessary TextareaProps interface that caused the error.

// Pass the required props type directly into forwardRef
const Textarea = React.forwardRef<
  HTMLTextAreaElement, // HTML element type
  React.TextareaHTMLAttributes<HTMLTextAreaElement> // Props type
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      ref={ref} 
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };