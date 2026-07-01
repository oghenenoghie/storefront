"use client";
import { AlertCircle } from "lucide-react";

interface Props {
  message?: string;
  onRetry: () => void;
  className?: string;
}

export default function ErrorState({ message = "Something went wrong. Please try again.", onRetry, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 gap-4 ${className}`}>
      <AlertCircle size={28} strokeWidth={1.5} className="text-[#8C8C8C]" />
      <p className="text-[#8C8C8C] text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="text-label border-b border-[#1A1A1A] pb-0.5 hover:opacity-60 transition-opacity"
      >
        Try Again →
      </button>
    </div>
  );
}
