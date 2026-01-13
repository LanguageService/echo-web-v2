"use client";

import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      router.push("/dashboard");
    } catch (error) {}
  };
  return (
    <main className="min-h-screen bg-[#F5FAFB] flex items-center justify-center px-4">
      {/* Card */}
      <div
        className="
          w-full
          max-w-md
          md:max-w-lg
          bg-white
          rounded-2xl
          shadow-sm
          border border-[#B9CED5]
          px-6
          md:px-10
          py-10
        "
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br
            from-[hsl(175,65%,40%)]
            via-[hsl(45,85%,58%)]
            to-[hsl(15,75%,55%)]
            flex items-center justify-center text-2xl shadow-md"
          >
            🌍
          </div>
        </div>
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#0C141D]">
          Welcome back
        </h1>
        <p className="text-sm text-center text-[#4D6680] mt-1">
          Log in to speak with the world instantly, in any language.
        </p>
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[#0C141D]">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#B9CED5] px-4 py-3 bg-white">
              <Mail className="w-4 h-4 text-[#4D6680]" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm text-[#0C141D]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-[#0C141D]">
              Password
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#B9CED5] px-4 py-3 bg-white">
              <Lock className="w-4 h-4 text-[#4D6680]" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-sm text-[#0C141D]"
              />
            </div>
          </div>
          <div className="text-right">
            <a href="#" className="text-xs text-black hover:underline">
              Forget Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full
              bg-[#D97706]
              hover:bg-orange-600
              text-white
              py-3
              rounded-xl
              font-semibold
              transition-colors
            "
          >
            Login
          </button>
        </form>
        <div className="mt-8 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-sm text-[#4D6680] whitespace-nowrap">
            or continue with
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="mt-6 grid grid-cols-3 justify-items-center">
          {/* Google */}
          <button className="flex items-center justify-center w-[64px] h-[56px] rounded-xl border border-[#DCDBDB] hover:bg-[#F5FAFB] transition-colors">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
          </button>

          {/* Facebook */}
          <button className="flex items-center justify-center w-[64px] h-[56px] rounded-xl border border-[#DCDBDB] hover:bg-[#F5FAFB] transition-colors">
            <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
          </button>
          {/* Apple */}
          <button className="flex items-center justify-center w-[64px] h-[56px] rounded-xl border border-[#DCDBDB] hover:bg-[#F5FAFB] transition-colors">
            <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-[#4D6680]">
          Don’t have an account?{" "}
          <Link href="/signup">
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Create one
            </span>
          </Link>
        </p>
      </div>
    </main>
  );
}
