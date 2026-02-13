import { motion } from "framer-motion";
import { Server, Zap, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const columns = [
    {
      title: t("how.providers"),
      Icon: Server,
      steps: [t("how.p1"), t("how.p2"), t("how.p3")],
    },
    {
      title: t("how.platform"),
      Icon: Zap,
      steps: [t("how.pl1"), t("how.pl2"), t("how.pl3")],
    },
    {
      title: t("how.renters"),
      Icon: Terminal,
      steps: [t("how.r1"), t("how.r2"), t("how.r3")],
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t("how.title")}
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {columns.map((col, colIdx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: colIdx * 0.15 }}
              className="group rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(37_91%_55%/0.08)]"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <col.Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{col.title}</h3>
              </div>

              <div className="flex flex-col gap-5">
                {col.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {stepIdx + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
