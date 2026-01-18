import { Camera, Menu } from "lucide-react";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
}

export default function ProfileHeader({
  firstName,
  lastName,
  email,
  profilePicture,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E7EC]">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#249E8E] via-[#F2C94C] to-[#E96A3A] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              `${firstName[0]}${lastName[0]}`
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#F79009] rounded-full flex items-center justify-center text-white hover:bg-[#E68200] transition-colors">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0C141D]">
            {firstName} {lastName}
          </h1>
          <p className="text-[#667085] mt-1">{email}</p>
        </div>
      </div>
    </div>
  );
}
