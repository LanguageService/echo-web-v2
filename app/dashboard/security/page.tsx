"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Shield, Save } from "lucide-react";

export default function SecurityPage() {
  const { toast, toasts } = useToast();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast("New passwords don't match");
      return;
    }

    if (formData.new_password.length < 6) {
      toast("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      toast("Password changed successfully!");
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      console.error("Password change error:", error);
      toast("Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Security
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? "text" : "password"}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white p-2 sm:p-3 rounded-lg font-medium transition text-sm sm:text-base"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        {/* Security Tips */}
        <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
            Password Tips:
          </h3>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid common words or personal information</li>
          </ul>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 space-y-2 z-50">
        {toasts.map((message, index) => (
          <div
            key={index}
            className="bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fade-in text-sm sm:text-base"
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
