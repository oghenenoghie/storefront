"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
      router.push("/");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0A0A0A] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1410] to-[#0A0A0A]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C9A96E]/10 blur-[80px]" />
        <div className="relative z-10 text-center px-16">
          <Link href="/" className="font-serif text-4xl text-white tracking-[0.15em] uppercase mb-8 block">
            Oghie
          </Link>
          <p className="font-serif text-2xl text-[#8A8A8A] font-light italic">
            "Luxury is in each detail"
          </p>
          <div className="mt-8 w-12 h-px bg-[#C9A96E] mx-auto" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7F4F0]">
        <div className="w-full max-w-md">
          <p className="text-label text-[#C9A96E] mb-4">Welcome Back</p>
          <h1 className="font-serif text-4xl font-light mb-2" style={{ letterSpacing: "-0.02em" }}>
            Sign In
          </h1>
          <p className="text-[#8A8A8A] font-light text-sm mb-10">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#C9A96E] hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-label block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white border border-[#E2DDD8] px-4 py-3.5 text-sm font-light focus:outline-none focus:border-[#C9A96E] transition-colors"
                placeholder="Enter your username"
              />
            </div>
            <div className="relative">
              <label className="text-label block mb-2">Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-[#E2DDD8] px-4 py-3.5 pr-12 text-sm font-light focus:outline-none focus:border-[#C9A96E] transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 bottom-4 text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors"
              >
                {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-white text-label py-4 hover:bg-[#C9A96E] transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E2DDD8]">
            <Link href="/" className="text-label text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors">
              ← Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
