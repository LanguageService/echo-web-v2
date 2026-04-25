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
import { ArrowLeft, Mail } from "lucide-react";
import { initiateForgotPassword, type ForgotPasswordRequest } from "@/lib/api";
import { z } from "zod";
import { toast } from "react-toastify";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);

    try {
      const response = await initiateForgotPassword(data);

      if (response.code === 200) {
        toast.success("Reset code sent to your email");
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error("Failed to send reset code");
      }
    } catch (error) {
      toast.error("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 pb-20 safe-area-bottom">
      <div className="flex items-center justify-center p-4 pt-8">
        <Card className="bg-[#eff4f5] dark:bg-gray-900 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1" />
            </div>
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full w-fit">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl echo-text">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a reset code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
