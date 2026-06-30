import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer bg-[#f0ece6]", className)}
      {...props}
    />
  );
}

export { Skeleton };
