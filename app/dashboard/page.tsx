import { Mic, MessageSquare, Image, Phone, Moon } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-24">
      {/* <h1 className="mt-12 text-[40px] font-bold leading-tight text-[#0C141D]"> */}
      <h1 className="mt-2 lg:mt-2 text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-[#0C141D]">
        Choose how you want to <br />
        <span className="text-[#12B76A]">translate</span> today.
      </h1>

      {/* Options */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* <div className="mt-10 grid grid-cols-4 gap-6"> */}
        <Card
          icon={<Mic className="text-[#F79009]" />}
          title="Voice"
          desc="Speak naturally. Echo translates instantly."
          active
        />

        <Card
          icon={<MessageSquare className="text-[#F79009]" />}
          title="Text"
          desc="Real conversations, translated in real time."
          active
        />

        <Card
          icon={<Image className="text-[#98A2B3]" />}
          title="Image"
          desc="Coming Soon"
          soon
        />

        <Card
          icon={<Phone className="text-[#98A2B3]" />}
          title="Call"
          desc="Coming Soon"
          soon
        />
      </div>

      {/* Recent */}
      {/* <div className="mt-14 flex items-center justify-between"> */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-[50px]">
        <h2 className="font-semibold text-lg text-[#0C141D]">
          Recent translations
        </h2>
        <span className="text-sm text-[#667085] cursor-pointer hover:underline">
          View All
        </span>
      </div>

      {/* Empty State */}
      <div className="mt-6 border border-dashed border-[#D0D5DD] rounded-2xl py-20 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center mb-4">
          ⏱️
        </div>

        <p className="font-semibold text-[#0C141D]">No translations yet</p>

        <p className="text-sm text-[#667085] mt-2 max-w-sm">
          Start one to build your history. Translations you make will appear
          here for easy access.
        </p>
      </div>
    </main>
  );
}

function Card({
  icon,
  title,
  desc,
  active,
  soon,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active?: boolean;
  soon?: boolean;
}) {
  const getLink = () => {
    if (soon) return "#"; // Disabled for coming soon items

    switch (title.toLowerCase()) {
      case "voice":
        return "/dashboard/voice";
      case "text":
        return "/dashboard/text";
      case "image":
        return "/dashboard/image";
      case "call":
        return "/dashboard/call";
      default:
        return "#";
    }
  };
  const link = getLink();
  return (
    <Link href={link}>
      <div
        className={`
        relative
        rounded-2xl
        p-6
        flex
        flex-col
        items-center
        text-center
        cursor-pointer
        transition-transform
        hover:scale-105
        ${active ? "bg-[#FFF7ED]" : "bg-[#F9FAFB]"}
        ${soon ? "opacity-60 cursor-not-allowed" : ""}
      `}
      >
        {soon && (
          <span className="absolute top-4 right-4 text-xs bg-[#F2F4F7] px-2 py-1 rounded-full text-[#667085]">
            Soon
          </span>
        )}

        <div className="w-12 h-12 rounded-full bg-[#FDEAD7] flex items-center justify-center mb-4">
          {icon}
        </div>

        <p className="font-semibold text-[#0C141D]">{title}</p>
        <p className="text-xs tracking-wide text-[#667085] mt-1">Translation</p>

        <p className="text-xs text-[#667085] mt-3">{desc}</p>
      </div>
    </Link>
  );
}
