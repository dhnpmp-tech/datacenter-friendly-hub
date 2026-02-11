import { useState } from "react";
import { ChevronDown } from "lucide-react";

const disclaimers = [
  {
    title: "Earnings Estimates",
    text: "Estimated earnings are projections based on current market rates and average utilization. Actual earnings may vary based on hardware performance, network conditions, demand fluctuations, and uptime. DC1 does not guarantee specific returns. Market rates are sourced from publicly available data and may not reflect real-time pricing.",
  },
  {
    title: "Hardware Detection",
    text: "Hardware information is detected locally in your browser using standard web APIs. No data is transmitted until you explicitly submit the form. DC1 does not install software or access your device beyond what your browser permits.",
  },
  {
    title: "General",
    text: "DC1 is a product of HAAK Energy Solutions Company (CR: 7041633988). The platform is currently in development. Features, pricing, and availability described on this page represent our planned offering and are subject to change. Early access registration does not constitute a binding agreement or guarantee of service.",
  },
  {
    title: "Energy Rates",
    text: 'Energy cost comparisons reference publicly available Saudi Electricity Company (SEC) tariff schedules and global averages. Actual rates depend on consumption tier, location, and applicable CITC licensing. The term "competitive" reflects Saudi Arabia\'s energy pricing relative to global datacenter markets.',
  },
  {
    title: "Regulatory Compliance",
    text: "DC1 is designed for alignment with SDAIA, NDMO, and PDPL requirements. Compliance status is subject to ongoing regulatory review and certification. References to regulatory frameworks do not imply formal endorsement or certification by any government body.",
  },
  {
    title: "Data Privacy",
    text: "Information submitted through this website is stored securely and used solely for the purpose of processing your early access request. We do not sell or share your personal data with third parties.",
    link: { href: "/privacy", label: "Privacy Policy" },
  },
];

const LegalSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-border bg-background">
      <div className="container mx-auto px-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Legal Disclaimers</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="pb-8 space-y-0 divide-y divide-border/50">
            {disclaimers.map((d) => (
              <div key={d.title} className="py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {d.title}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground/80">
                  {d.text}
                  {d.link && (
                    <>
                      {" "}For details, see our{" "}
                      <a href={d.link.href} className="text-primary hover:underline">
                        {d.link.label}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LegalSection;
