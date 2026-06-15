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
import { signUpUser, googleLoginUser, type SignUpRequest } from "@/lib/api";
import { z } from "zod";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';

const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpRequest) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await signUpUser(data);

      if (response.code === 201) {
        toast.success(
          "Account created successfully! Check your email for verification code.",
        );
        // Store email for OTP verification
        localStorage.setItem("signup_email", data.email);
        router.push("/verify-otp");
      } else {
        setError(response.message || "Signup failed");
        toast.error("Signup failed");
      }
    } catch (error) {
      setError("Failed to create account. Please try again.");
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 pb-20 safe-area-bottom">
      <div className=" flex items-center justify-center p-4 pt-8">
        <Card className="bg-[#eff4f5] dark:bg-gray-900 w-full max-w-md">
          <CardHeader className="text-center">
            <div
              onClick={handleBack}
              className="cursor-pointer mx-auto mb-4 p-3 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full w-fit"
            >
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl echo-text">
              ✨ Create an Account ✨
            </CardTitle>
            <CardDescription>
              Create your ECHO account, and start speaking with the world.
            </CardDescription>
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
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your first name here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your last name here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-black"
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
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </Form>

            <p className="text-center pt-5 text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-primary font-semibold underline hover:no-underline"
              >
                Login
              </button>
            </p>
            <div className="mt-8 flex items-center">
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
              <span className="mx-4 text-sm text-[#4D6680] dark:text-gray-400 whitespace-nowrap">
                or continue with
              </span>
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>

            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setIsLoading(true);
                    if (!credentialResponse.credential) throw new Error("No credential received");
                    const response = await googleLoginUser(credentialResponse.credential);
                    if (response.code === 200 && response.data?.token?.access) {
                      localStorage.setItem("token", response.data.token.access);
                      localStorage.setItem("refreshToken", response.data.token.refresh);
                      document.cookie = `token=${response.data.token.access}; path=/; max-age=86400; SameSite=Lax`;
                      toast.success("Login successful");
                      router.push("/dashboard");
                    } else {
                      throw new Error(response.message || "Login failed");
                    }
                  } catch (err: any) {
                    toast.error(err.message || "Google Login failed");
                    setError(err.message || "Google Login failed");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
