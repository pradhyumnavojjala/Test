// ./src/Components/ui/switch.tsx

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

// 1. Define the props interface by extending the Radix Switch Root Props.
// This ensures all standard props like 'checked', 'onCheckedChange', etc., are correctly typed.
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  // Add any custom props here if you had them
}

// 2. Use the new interface in the component definition.
export const Switch = ({ className, ...props }: SwitchProps) => (
  <SwitchPrimitive.Root
    className={cn(
      "w-10 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block w-4 h-4 bg-white rounded-full translate-x-1 transition-transform data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
);