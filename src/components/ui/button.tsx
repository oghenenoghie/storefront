import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0A0A0A] text-white shadow hover:bg-[#C9A96E]",
        destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        outline: "border border-[#E2DDD8] bg-white shadow-sm hover:border-[#C9A96E] hover:text-[#C9A96E]",
        secondary: "bg-[#F7F4F0] text-[#0A0A0A] shadow-sm hover:bg-[#E8E0D5]",
        ghost: "hover:bg-[#F7F4F0] hover:text-[#0A0A0A]",
        link: "text-[#C9A96E] underline-offset-4 hover:underline",
        gold: "bg-[#C9A96E] text-[#0A0A0A] shadow hover:bg-[#E0C896]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-sm",
        xl: "h-14 px-10",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
