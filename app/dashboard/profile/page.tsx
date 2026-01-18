"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  fetchUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/api";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (error: any) {
      if (error.message.includes("No authentication token")) {
        toast.error("Please login to view your profile");
        router.push("/login");
      } else {
        toast.error("Failed to load profile");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<UserProfile>) => {
    if (!profile) return;

    setSaving(true);
    try {
      const updated = await updateUserProfile(profile.id, data);
      setProfile(updated);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F79009] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#667085]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#667085]">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0C141D]">
          My Profile
        </h1>
      </div>

      <ProfileHeader
        firstName={profile.first_name}
        lastName={profile.last_name}
        email={profile.email}
        profilePicture={profile.profile_picture}
      />

      <ProfileStats
        isVerified={profile.is_verified}
        dateJoined={profile.date_joined}
        isActive={profile.is_active}
      />

      <ProfileForm profile={profile} onSave={handleSave} isLoading={saving} />
    </div>
  );
}
