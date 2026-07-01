"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1A1A1A] items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center px-16 space-y-6">
          <Link href="/" className="font-serif text-4xl text-white tracking-[0.3em] uppercase block">
            Oghie
          </Link>
          <div className="w-12 h-px bg-white mx-auto" />
          <p className="font-serif text-xl text-[#8C8C8C] font-light italic">
            "Luxury is in each detail"
          </p>
          <div className="mt-12 space-y-3 text-left">
            {["Curated premium collection", "Secure & fast checkout", "Free returns within 30 days"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-[#8C8C8C] text-sm font-normal">
                <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7F7F7]">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
              <p className="text-label text-[#8C8C8C] mb-2">Welcome Back</p>
              <CardTitle className="text-4xl">Sign In</CardTitle>
              <CardDescription className="text-base font-light mt-2">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#1A1A1A] hover:underline underline-offset-2">
                  Create one
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="rounded-none h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-[#1A1A1A] transition-colors"
                    >
                      {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-none mt-2 tracking-[0.15em]"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              <Separator className="my-8" />

              <Button asChild variant="ghost" size="sm" className="text-[#8C8C8C] pl-0">
                <Link href="/">← Continue as Guest</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
