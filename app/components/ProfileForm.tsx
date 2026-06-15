"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserProfile, UpdateUserProfileRequest } from "@/lib/api";
import { Save } from "lucide-react";
import { Country, State } from "country-state-city";
import type { StylesConfig } from "react-select";

// react-select must be loaded client-side only (no SSR)
const Select = dynamic(() => import("react-select"), { ssr: false });

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (data: UpdateUserProfileRequest) => void;
  isLoading: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

const labelClass = "block text-sm font-medium text-[#344054] dark:text-gray-300 mb-2";

function useSelectStyles(isDark = false): StylesConfig<SelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderColor: state.isFocused ? "#f97316" : isDark ? "#4b5563" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(249,115,22,0.25)" : "none",
      borderRadius: "0.5rem",
      minHeight: "42px",
      fontSize: "0.875rem",
      "&:hover": { borderColor: "#f97316" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      borderRadius: "0.5rem",
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
        ? isDark ? "#374151" : "#fef3e2"
        : "transparent",
      color: state.isSelected ? "#fff" : isDark ? "#f3f4f6" : "#0c141d",
      fontSize: "0.875rem",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#f3f4f6" : "#0c141d",
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "#f3f4f6" : "#0c141d",
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      fontSize: "0.875rem",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      "&:hover": { color: "#f97316" },
    }),
  };
}

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

  // Build country options once
  const countryOptions: SelectOption[] = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: c.name,
      })),
    []
  );

  // States for the resident country (drives the State/County dropdown)
  const stateOptions: SelectOption[] = useMemo(() => {
    if (!formData.resident_country) return [];
    return State.getStatesOfCountry(formData.resident_country).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [formData.resident_country]);

  // Resolve display values for controlled selects
  const originCountryValue = countryOptions.find((o) => o.value === formData.origin_country) ?? null;
  const residentCountryValue = countryOptions.find((o) => o.value === formData.resident_country) ?? null;
  const stateValue = stateOptions.find((o) => o.value === formData.state || o.label === formData.state) ?? null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (field: "origin_country" | "resident_country") => (opt: SelectOption | null) => {
    const updates: Partial<typeof formData> = { [field]: opt?.value ?? "" };
    // Clear state when resident country changes
    if (field === "resident_country") updates.state = "";
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleStateChange = (opt: SelectOption | null) => {
    setFormData((prev) => ({ ...prev, state: opt?.value ?? "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Resolve country name for saving (backend expects name, not ISO code)
    const originName = Country.getCountryByCode(formData.origin_country)?.name ?? formData.origin_country;
    const residentName = Country.getCountryByCode(formData.resident_country)?.name ?? formData.resident_country;
    const stateName = formData.resident_country
      ? (State.getStatesOfCountry(formData.resident_country).find((s) => s.isoCode === formData.state)?.name ?? formData.state)
      : formData.state;

    onSave({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || null,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth || null,
      address: formData.address,
      city: formData.city || null,
      state: stateName || null,
      origin_country: originName || null,
      resident_country: residentName || null,
      occupation: formData.occupation || null,
    });
  };

  // Detect dark mode from the document class
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const selectStyles = useSelectStyles(isDark);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E7EC] dark:border-gray-700">
        <h2 className="text-xl font-semibold text-[#0C141D] dark:text-white mb-6">Personal Information</h2>

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
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-[#0C141D] dark:text-white"
            >
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

          {/* Origin Country */}
          <div>
            <label className={labelClass}>Origin Country</label>
            <Select
              instanceId="origin_country"
              options={countryOptions}
              value={originCountryValue}
              onChange={handleCountryChange("origin_country") as any}
              styles={selectStyles as any}
              placeholder="Search country..."
              isClearable
            />
          </div>

          {/* Resident Country */}
          <div>
            <label className={labelClass}>Resident Country</label>
            <Select
              instanceId="resident_country"
              options={countryOptions}
              value={residentCountryValue}
              onChange={handleCountryChange("resident_country") as any}
              styles={selectStyles as any}
              placeholder="Search country..."
              isClearable
            />
          </div>

          {/* State / County — dynamic based on resident country */}
          <div>
            <label className={labelClass}>
              State / County
              {formData.resident_country && stateOptions.length === 0 && (
                <span className="ml-2 text-xs text-gray-400 font-normal">(type manually)</span>
              )}
            </label>
            {stateOptions.length > 0 ? (
              <Select
                instanceId="state"
                options={stateOptions}
                value={stateValue}
                onChange={handleStateChange as any}
                styles={selectStyles as any}
                placeholder="Select state / county..."
                isClearable
              />
            ) : (
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state or county"
              />
            )}
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
