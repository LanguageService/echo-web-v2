"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const isComplete = code.every((digit) => digit !== "");

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 🔥 Auto verify when all 6 digits are filled
  useEffect(() => {
    if (isComplete) {
      verifyCode();
    }
  }, [isComplete]);

  const verifyCode = async () => {
    if (loading) return;
    setLoading(true);

    const otp = code.join("");

    // Simulate backend verification
    await new Promise((res) => setTimeout(res, 1200));

    // For demo: only "123456" succeeds
    if (otp === "123456") {
      toast.success("Verification successful");
      router.push("/verify/success");
    } else {
      toast.error("Verification failed");
      //   alert("Invalid code");
      setCode(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow">
        <h1 className="text-xl font-semibold">Verify your email</h1>
        <p className="text-sm text-gray-500 mt-2">
          We’ve sent a 6-digit code to your@gmail.com. Enter it below.
        </p>

        <div className="flex justify-between gap-2 mt-6">
          {code.map((digit, i) => (
            <input
              key={i}
              //   ref={(el) => (inputsRef.current[i] = el)}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-12 sm:w-14 sm:h-14 border border-[#F2C48D] rounded-md text-center text-lg font-semibold focus:ring-2 focus:ring-[#F2C48D]"
            />
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t get the code?{" "}
          <span className="text-[#F2C48D] font-medium cursor-pointer">
            Resend
          </span>
        </p>

        <button
          disabled={!isComplete || loading}
          className={`w-full mt-6 py-3 rounded-full text-white font-semibold transition ${
            isComplete
              ? "bg-[#F2C48D] hover:opacity-90"
              : "bg-[#F2C48D]/40 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </main>
  );
}
