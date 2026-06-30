import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full border border-[#E2DDD8] bg-white px-3 py-2 text-sm font-light transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#C0B8B0] focus-visible:outline-none focus-visible:border-[#C9A96E] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
