import type { JSX } from 'react';

const partners: string[] = [
  "Google",
  "Amazon",
  "Meta",
  "Microsoft",
  "Stanford",
  "MIT",
  "University of Cape Town",
  "University of the Witwatersrand",
  "Stellenbosch University",
  "University of Pretoria",
  "Harvard University"
];

export default function TrustBadges(): JSX.Element {
  const displayPartners: string[] = [...partners, ...partners];

  return (
    <div className="bg-[#0F1A2E]/2 border-y border-[#0F1A2E]/5 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <p className="text-center text-sm font-bold text-[#0F1A2E]/30 uppercase tracking-widest">
          Empowering students and professionals from world-class institutions
        </p>
      </div>

      <div className="relative fade-edges">
        <div className="animate-scroll flex items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
          {displayPartners.map((partner: string, index: number) => (
            <span
              key={index}
              className={`text-2xl md:text-3xl font-black text-[#0F1A2E] tracking-tighter whitespace-nowrap px-4
                ${
                  partner.includes("University") ||
                  partner.includes("Stanford") ||
                  partner.includes("MIT") ||
                  partner.includes("Harvard")
                    ? ""
                    : "italic"
                }
                ${
                  partner === "Microsoft"
                    ? "underline decoration-[#C9A96E] underline-offset-4"
                    : ""
                }
              `}
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}