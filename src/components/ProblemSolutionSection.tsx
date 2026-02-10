import { motion } from "framer-motion";
import { CircleAlert, Zap, Globe, ShieldCheck, Users, BatteryCharging } from "lucide-react";

const problems = [
  {
    icon: Globe,
    text: "Cloud compute is expensive, centralized, and barely exists in the MENA region.",
  },
  {
    icon: Zap,
    text: "GPU demand is exploding. Supply is locked behind hyperscalers charging 3-5x markup.",
  },
  {
    icon: ShieldCheck,
    text: "Saudi regulations require data sovereignty — but local compute options are almost nonexistent.",
  },
];

const solutions = [
  {
    icon: Users,
    text: "We connect hardware owners directly to developers who need compute. No middleman markup.",
  },
  {
    icon: BatteryCharging,
    text: "Powered by Saudi Arabia's competitive energy rates — up to 60% lower than global average.",
  },
  {
    icon: ShieldCheck,
    text: "SDAIA-compliant from day one. Your data stays in the Kingdom. Always.",
  },
];

const ProblemSolutionSection = () => {
  return (
    <section id="problem-solution" className="bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground">The Problem</h2>
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

          {/* Right — The DC1 Solution */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-2xl font-bold text-foreground">
              The <span className="text-primary">DC1</span> Solution
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
