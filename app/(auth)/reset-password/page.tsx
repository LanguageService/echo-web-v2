// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/Card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/Form";
// import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
// import { resetPassword, type ResetPasswordRequest } from "@/lib/api";
// import { z } from "zod";
// import { toast } from "react-toastify";

// const resetPasswordSchema = z
//   .object({
//     otp_code: z.string().min(6, "OTP must be at least 6 characters"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirm_password: z
//       .string()
//       .min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirm_password, {
//     message: "Passwords don't match",
//     path: ["confirm_password"],
//   });

// export default function ResetPassword() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const emailParam = searchParams.get("email");
//     if (emailParam) {
//       setEmail(emailParam);
//     }
//   }, [searchParams]);

//   const form = useForm<ResetPasswordRequest>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       otp_code: "",
//       password: "",
//       confirm_password: "",
//     },
//   });

//   const onSubmit = async (data: ResetPasswordRequest) => {
//     setIsLoading(true);

//     try {
//       const response = await resetPassword(data);

//       if (response.code === 200) {
//         toast.success("Password reset successfully");
//         router.push("/login");
//       } else {
//         toast.error("Failed to reset password");
//       }
//     } catch (error) {
//       toast.error("Failed to reset password. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 pb-20 safe-area-bottom">
//       <div className="flex items-center justify-center p-4 pt-8">
//         <Card className="bg-[#eff4f5] w-full max-w-md">
//           <CardHeader className="text-center">
//             <div className="flex items-center justify-between mb-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => router.push("/forgot-password")}
//                 className="flex items-center gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//               </Button>
//               <div className="flex-1" />
//             </div>
//             <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full w-fit">
//               <Lock className="h-6 w-6 text-white" />
//             </div>
//             <CardTitle className="text-2xl echo-text">Reset Password</CardTitle>
//             <CardDescription>
//               Enter the code sent to{" "}
//               {email && <span className="font-medium">{email}</span>}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="otp_code"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Reset Code</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Enter the 6-digit code"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>New Password</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={showPassword ? "text" : "password"}
//                             placeholder="Enter new password"
//                             {...field}
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-black"
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? (
//                               <EyeOff className="h-4 w-4" />
//                             ) : (
//                               <Eye className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="confirm_password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={showConfirmPassword ? "text" : "password"}
//                             placeholder="Confirm new password"
//                             {...field}
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-black"
//                             onClick={() =>
//                               setShowConfirmPassword(!showConfirmPassword)
//                             }
//                           >
//                             {showConfirmPassword ? (
//                               <EyeOff className="h-4 w-4" />
//                             ) : (
//                               <Eye className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Resetting..." : "Reset Password"}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword, type ResetPasswordRequest } from "@/lib/api";
import { z } from "zod";
import { toast } from "react-toastify";

const resetPasswordSchema = z
  .object({
    otp_code: z.string().min(6, "OTP must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp_code: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordRequest) => {
    setIsLoading(true);

    try {
      const response = await resetPassword(data);

      if (response.code === 200) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 pb-20 safe-area-bottom">
      <div className="flex items-center justify-center p-4 pt-8">
        <Card className="bg-[#eff4f5] w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/forgot-password")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1" />
            </div>
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] rounded-full w-fit">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl echo-text">Reset Password</CardTitle>
            <CardDescription>
              Enter the code sent to{" "}
              {email && <span className="font-medium">{email}</span>}
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
                  name="otp_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reset Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter the 6-digit code"
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
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
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

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-black"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
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
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
