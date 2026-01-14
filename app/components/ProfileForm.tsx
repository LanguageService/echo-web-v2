"use client";

import { useState } from "react";
import { Input } from "@/Components/ui/Input";
import { Button } from "@/Components/ui/Button";
import { UserProfile } from "@/lib/api";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  isLoading: boolean;
}

export default function ProfileForm({
  profile,
  onSave,
  isLoading,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone: profile.phone || "",
    gender: profile.gender,
    date_of_birth: profile.date_of_birth || "",
    address: profile.address,
    city: profile.city || "",
    state: profile.state || "",
    origin_country: profile.origin_country || "",
    resident_country: profile.resident_country || "",
    occupation: profile.occupation || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E7EC]">
        <h2 className="text-xl font-semibold text-[#0C141D] mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              First Name
            </label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Last Name
            </label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Phone
            </label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79009]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Date of Birth
            </label>
            <Input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Occupation
            </label>
            <Input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              City
            </label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              State
            </label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Origin Country
            </label>
            <Input
              name="origin_country"
              value={formData.origin_country}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Resident Country
            </label>
            <Input
              name="resident_country"
              value={formData.resident_country}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#344054] mb-2">
              Address
            </label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          //   variant="outline"
          variant="ghost"
          className="px-6"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 bg-[#F79009] hover:bg-[#E68200]"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
