"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserProfile, UpdateUserProfileRequest } from "@/lib/api";
import { Save } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (data: UpdateUserProfileRequest) => void;
  isLoading: boolean;
}

const labelClass = "block text-sm font-medium text-[#344054] dark:text-gray-300 mb-2";
const selectClass = "w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-[#0C141D] dark:text-white";

export default function ProfileForm({ profile, onSave, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    gender: profile.gender || "",
    date_of_birth: profile.date_of_birth || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    origin_country: profile.origin_country || "",
    resident_country: profile.resident_country || "",
    occupation: profile.occupation || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || null,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth || null,
      address: formData.address,
      city: formData.city || null,
      state: formData.state || null,
      origin_country: formData.origin_country || null,
      resident_country: formData.resident_country || null,
      occupation: formData.occupation || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E7EC] dark:border-gray-700">
        <h2 className="text-xl font-semibold text-[#0C141D] dark:text-white mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelClass}>First Name</label>
            <Input name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} required disabled className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={selectClass}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>Occupation</label>
            <Input name="occupation" value={formData.occupation} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <Input name="state" value={formData.state} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>Origin Country</label>
            <Input name="origin_country" value={formData.origin_country} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClass}>Resident Country</label>
            <Input name="resident_country" value={formData.resident_country} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" className="px-6 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="cursor-pointer px-6 bg-[#F79009] hover:bg-[#E68200] text-white">
          {isLoading ? "Saving..." : "Save Changes"}
          <Save className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
