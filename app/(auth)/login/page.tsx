"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { loginUser, type LoginRequest } from "@/lib/api";
import { z } from "zod";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(data);

      if (response.code === 200 && response.token?.access) {
        // Store access token
        localStorage.setItem("token", response.token.access);
        localStorage.setItem("refreshToken", response.token.refresh);
        toast.success("Login successful");
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        toast.error("Login failed");
        setError(response.message || "Login failed");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    // <div className="min-h-screen pb-20 safe-area-bottom">
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 pb-20 safe-area-bottom">
      <div className=" flex items-center justify-center p-4 pt-8">
        <Card className=" bg-[#eff4f5] w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1" />
            </div>
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full w-fit">
              {/* <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-primary via-accent to-secondary rounded-full w-fit"> */}
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl echo-text">
              ✨ Welcome Back ✨
            </CardTitle>
            <CardDescription>Sign in to your ECHO account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-black"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-primary"
                    onClick={() => router.push("/signup")}
                  >
                    Create one here
                  </Button>
                </div>
              </form>
            </Form>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
