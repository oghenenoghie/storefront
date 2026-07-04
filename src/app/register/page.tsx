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

interface FieldErrors {
  [key: string]: string[] | string;
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const { register } = useAuthStore();
  const router = useRouter();

  const fieldError = (field: string) => {
    const err = errors[field];
    if (!err) return null;
    return Array.isArray(err) ? err.join(" ") : err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      setErrors({ password2: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register({
        username,
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
      });
      toast.success("Account created! Welcome to Oghie.");
      router.push("/");
    } catch (err: unknown) {
      const response = (err as { response?: { data?: FieldErrors } })?.response;
      if (response?.data && typeof response.data === "object") {
        setErrors(response.data);
        toast.error("Please fix the errors below.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Brand panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0A0A0A] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1410] to-[#0A0A0A]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C9A96E]/10 blur-[80px]" />
        <div className="relative z-10 text-center px-16 space-y-6">
          <Link href="/" className="font-serif text-4xl text-white tracking-[0.15em] uppercase block">
            Oghie
          </Link>
          <div className="w-12 h-px bg-[#C9A96E] mx-auto" />
          <p className="font-serif text-xl text-[#8A8A8A] font-light italic">
            &ldquo;Luxury is in each detail&rdquo;
          </p>
          <div className="mt-12 space-y-3 text-left">
            {["Curated premium collection", "Secure & fast checkout", "Free returns within 30 days"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-[#5A5A5A] text-sm font-light">
                <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7F4F0]">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
              <p className="text-label text-[#C9A96E] mb-2">Join Oghie</p>
              <CardTitle className="text-4xl">Create Account</CardTitle>
              <CardDescription className="text-base font-light mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-[#C9A96E] hover:underline underline-offset-2">
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="rounded-none h-12"
                    />
                    {fieldError("first_name") && (
                      <p className="text-xs text-red-600">{fieldError("first_name")}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="rounded-none h-12"
                    />
                    {fieldError("last_name") && (
                      <p className="text-xs text-red-600">{fieldError("last_name")}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                    className="rounded-none h-12"
                  />
                  {fieldError("username") && (
                    <p className="text-xs text-red-600">{fieldError("username")}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="rounded-none h-12"
                  />
                  {fieldError("email") && (
                    <p className="text-xs text-red-600">{fieldError("email")}</p>
                  )}
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
                      placeholder="Create a password"
                      className="rounded-none h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors"
                    >
                      {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {fieldError("password") && (
                    <p className="text-xs text-red-600">{fieldError("password")}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password2">Confirm Password</Label>
                  <Input
                    id="password2"
                    type={showPass ? "text" : "password"}
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    placeholder="Repeat your password"
                    className="rounded-none h-12"
                  />
                  {fieldError("password2") && (
                    <p className="text-xs text-red-600">{fieldError("password2")}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-none mt-2 tracking-[0.15em]"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </form>

              <Separator className="my-8" />

              <Button asChild variant="ghost" size="sm" className="text-[#8A8A8A] pl-0">
                <Link href="/">← Continue as Guest</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
