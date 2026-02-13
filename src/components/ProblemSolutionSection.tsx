import { motion } from "framer-motion";
import { CircleAlert, Zap, Globe, ShieldCheck, Users, BatteryCharging } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProblemSolutionSection = () => {
  const { t } = useLanguage();

  const problems = [
    { icon: Globe, text: t("problem.1") },
    { icon: Zap, text: t("problem.2") },
    { icon: ShieldCheck, text: t("problem.3") },
  ];

  const solutions = [
    { icon: Users, text: t("solution.1") },
    { icon: BatteryCharging, text: t("solution.2") },
    { icon: ShieldCheck, text: t("solution.3") },
  ];

  return (
    <section id="problem-solution" className="bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground">{t("problem.title")}</h2>
            <div className="mt-8 flex flex-col gap-6">
              {problems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                    <item.icon size={16} className="text-destructive" />
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-2xl font-bold text-foreground">
              {t("solution.title")}
            </h2>
            <div className="mt-8 flex flex-col gap-6">
              {solutions.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
