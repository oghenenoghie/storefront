import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full border border-[#E0E0E0] bg-white px-3 py-2 text-sm font-light transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
