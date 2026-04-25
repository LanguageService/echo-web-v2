

// interface BadgeProps {
//   code: string;
//   label: string;
// }

// export default function Badge({ code, label }: BadgeProps) {
//   return (
//     <div className="flex items-center gap-2 border border-[#b9ced5] hover:border-[#F79009] rounded-xl px-4 py-2">
//       <span className="font-semibold text-sm">{code}</span>
//       <span className="text-sm text-[#667085]">{label}</span>
//     </div>
//   );
// }



import ReactCountryFlag from "react-country-flag";

const languageToCountry: Record<string, string> = {
  EN: "GB",
  RW: "RW",
  FR: "FR",
  AR: "SA",
  PT: "PT",
  ES: "ES",
  HA: "NG",
  IG: "NG",
  SW: "TZ",
  YO: "NG",
};

interface BadgeProps {
  code: string;
  label: string;
}

export default function Badge({ code, label }: BadgeProps) {
  return (
    <div className="flex items-center gap-2 border border-[#b9ced5] hover:border-[#F79009] rounded-xl px-4 py-2">
      <ReactCountryFlag
        countryCode={languageToCountry[code.toUpperCase()] ?? code.toUpperCase()}
        svg
        style={{ width: "1.5em", height: "1.5em" }}
      />
      <span className="text-sm text-[#667085]">{label}</span>
    </div>
  );
}
