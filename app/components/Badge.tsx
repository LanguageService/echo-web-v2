interface BadgeProps {
  code: string;
  label: string;
}

export default function Badge({ code, label }: BadgeProps) {
  return (
    <div className="flex items-center gap-2 border border-[#b9ced5] hover:border-[#F79009] rounded-xl px-4 py-2">
      <span className="font-semibold text-sm">{code}</span>
      <span className="text-sm text-[#667085]">{label}</span>
    </div>
  );
}
