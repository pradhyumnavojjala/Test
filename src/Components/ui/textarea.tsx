// Corrected content for: ./src/Components/ui/textarea.tsx

import * as React from "react" 
import { cn } from "@/lib/utils";

// 1. Define the props interface cleanly
export interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// 2. Use the defined interface in forwardRef and ensure it is exported
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        ref={ref} // Ensure the ref is passed down
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; // <--- FIX: Export the component correctly