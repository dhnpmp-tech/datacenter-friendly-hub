import { ShieldCheck, Building2, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();

  const items = [
    { Icon: ShieldCheck, text: t("trust.sdaia") },
    { Icon: Building2, text: t("trust.registered") },
    { Icon: Rocket, text: t("trust.startup") },
  ];

  return (
    <section className="bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-0">
          {items.map((item, i) => (
            <div key={item.text} className="flex items-center gap-3">
              {i > 0 && (
                <span className="mx-6 hidden h-4 w-px bg-border sm:block" />
              )}
              <item.Icon size={16} className="shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
