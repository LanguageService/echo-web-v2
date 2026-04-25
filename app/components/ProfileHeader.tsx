"use client";

import { Camera } from "lucide-react";
import { useState } from "react";
import { updateUserProfile, type UserProfile, type UpdateUserProfileRequest } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  userId: number;
  profile: UserProfile;
  onProfileUpdate?: () => void;
}

export default function ProfileHeader({
  firstName, lastName, email, profilePicture, userId, profile, onProfileUpdate,
}: ProfileHeaderProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsUploading(true);
      try {
        const updateData: UpdateUserProfileRequest = {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          gender: profile.gender,
          phone: profile.phone,
          origin_country: profile.origin_country,
          resident_country: profile.resident_country,
          occupation: profile.occupation,
          city: profile.city,
          state: profile.state,
          address: profile.address,
          date_of_birth: profile.date_of_birth,
          profile_picture: url,
        };
        await updateUserProfile(userId, updateData);
        toast("Profile picture updated successfully!");
        onProfileUpdate?.();
      } catch {
        toast("Failed to update profile picture");
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E7EC] dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-orange-500 bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              `${firstName[0]}${lastName[0]}`
            )}
          </div>
          <label className={`absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#F79009] rounded-full flex items-center justify-center text-white hover:bg-[#E68200] transition-colors cursor-pointer ${isUploading ? "opacity-50" : ""}`}>
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
          </label>
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C141D] dark:text-white">
            {firstName} {lastName}
          </h2>
          <p className="text-[#667085] dark:text-gray-400 mt-1">{email}</p>
        </div>
      </div>
    </div>
  );
}
