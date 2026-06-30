import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0A0A0A] text-white",
        secondary: "border-transparent bg-[#F7F4F0] text-[#0A0A0A]",
        destructive: "border-transparent bg-destructive text-white",
        outline: "border-[#E2DDD8] text-[#0A0A0A]",
        gold: "border-transparent bg-[#C9A96E] text-[#0A0A0A]",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-amber-100 text-amber-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
