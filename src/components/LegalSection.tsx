import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const disclaimers = [
  {
    title: "Earnings Estimates",
    text: "Estimated earnings are projections based on current global marketplace rates and historical utilization averages. Actual earnings may vary significantly based on hardware condition, network bandwidth, geographic demand, uptime, and market fluctuations. DC1 does not guarantee specific returns or minimum utilization rates. The 15% platform fee shown reflects DC1's market maker spread and covers billing, security, compliance, and demand matching. Projections assume 24/7 availability — actual availability will reduce earnings proportionally.",
  },
  {
    title: "Market Data Sources",
    text: "GPU rental rates and utilization figures are sourced from the vast.ai global marketplace index (500.farm/vastai-exporter) and updated hourly. These rates represent median global prices and may differ from rates achievable on the DC1 platform. Past market performance does not guarantee future rates. DC1 marketplace pricing will be determined by our market maker model and may differ from third-party marketplace rates shown in estimates.",
  },
  {
    title: "Hardware Detection",
    text: "Hardware information is detected locally in your browser using standard WebGL APIs. All detection occurs client-side — no data is transmitted to DC1 servers until you explicitly submit a form. DC1 does not install software, run benchmarks, or access your device beyond what your browser permits. Detection accuracy depends on browser settings and driver configuration; results may not reflect your actual hardware in all cases.",
  },
  {
    title: "Energy Rates",
    text: 'Energy cost comparisons reference publicly available Saudi Electricity Company (SEC) tariff schedules (0.18 SAR/kWh for licensed cloud operators) and International Energy Agency (IEA) country averages. Actual energy costs depend on consumption tier, location, provider contract, and applicable CITC licensing category. The term "competitive" reflects Saudi Arabia\'s energy pricing relative to global datacenter markets and does not constitute a price guarantee. Power consumption estimates use manufacturer-specified TDP ratings with a 30% system overhead factor.',
  },
  {
    title: "General",
    text: "DC1 is a product of HAAK Energy Solutions Company (CR: 7041633988), Kingdom of Saudi Arabia. The platform is currently in pre-launch development. All features, pricing models, and service availability described on this website represent planned offerings and are subject to change without notice. Early access registration does not constitute a binding agreement, guarantee of service, or reservation of capacity.",
  },
  {
    title: "Regulatory Compliance",
    text: "DC1 is designed for alignment with SDAIA (Saudi Data and AI Authority), NDMO (National Data Management Office), and PDPL (Personal Data Protection Law) requirements. References to regulatory frameworks describe our compliance objectives and do not imply formal endorsement, certification, or approval by any government body. Compliance status is subject to ongoing regulatory review and certification processes.",
  },
  {
    title: "Data Privacy",
    text: "Information submitted through this website is stored securely and processed in accordance with the Saudi Personal Data Protection Law (PDPL). We do not sell, rent, or share your personal data with third parties for marketing purposes. All data processing is limited to the purposes stated at the time of collection.",
    link: { href: "/privacy", label: "Privacy Policy" },
  },
];

const LegalSection = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <section className="border-t border-border bg-background">
      <div className="container mx-auto px-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{t("legal.title")}</span>
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
