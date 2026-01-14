import { CheckCircle, Calendar, Shield } from "lucide-react";

interface ProfileStatsProps {
  isVerified: boolean;
  dateJoined: string;
  isActive: boolean;
}

export default function ProfileStats({
  isVerified,
  dateJoined,
  isActive,
}: ProfileStatsProps) {
  const joinedDate = new Date(dateJoined).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-[#12B76A]" />}
        label="Verification Status"
        value={isVerified ? "Verified" : "Not Verified"}
        color={isVerified ? "green" : "orange"}
      />
      <StatCard
        icon={<Calendar className="w-5 h-5 text-[#F79009]" />}
        label="Member Since"
        value={joinedDate}
        color="orange"
      />
      <StatCard
        icon={<Shield className="w-5 h-5 text-[#12B76A]" />}
        label="Account Status"
        value={isActive ? "Active" : "Inactive"}
        color={isActive ? "green" : "red"}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#E4E7EC]">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm text-[#667085]">{label}</span>
      </div>
      <p className="text-lg font-semibold text-[#0C141D]">{value}</p>
    </div>
  );
}
