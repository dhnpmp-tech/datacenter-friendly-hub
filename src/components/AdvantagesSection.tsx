import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Layers, DollarSign, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AdvantagesSection = () => {
  const { t } = useLanguage();

  const cards = [
    { Icon: Zap, title: t("adv.energy"), text: t("adv.energy_desc") },
    { Icon: ShieldCheck, title: t("adv.sovereignty"), text: t("adv.sovereignty_desc") },
    { Icon: Cpu, title: t("adv.agnostic"), text: t("adv.agnostic_desc") },
    { Icon: Layers, title: t("adv.security"), text: t("adv.security_desc") },
    { Icon: DollarSign, title: t("adv.pricing"), text: t("adv.pricing_desc") },
    { Icon: Globe, title: t("adv.global"), text: t("adv.global_desc") },
  ];

  return (
    <section id="advantages" className="bg-card py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t("adv.title")}
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-xl border border-border/40 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <card.Icon size={20} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
