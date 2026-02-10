import { motion } from "framer-motion";
import { Server, Zap, Terminal } from "lucide-react";

const columns = [
  {
    title: "For Providers",
    Icon: Server,
    steps: [
      "Connect your hardware — GPU, CPU, or storage",
      "Set your availability and preferences",
      "Earn competitive returns. We handle billing, security, and compliance.",
    ],
  },
  {
    title: "The Platform",
    Icon: Zap,
    steps: [
      "DC1 matches supply with demand automatically",
      "Market maker pricing — fair rates guaranteed both sides",
      "3-layer security: Guardian, Watcher, and Auditor protect every transaction",
    ],
  },
  {
    title: "For Renters",
    Icon: Terminal,
    steps: [
      "Browse available compute by type, location, and price",
      "Deploy workloads in minutes with simple API or dashboard",
      "Pay only for what you use — no commitments, no lock-in",
    ],
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          How <span className="text-primary">It Works</span>
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
