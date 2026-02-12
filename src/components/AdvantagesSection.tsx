import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Layers, DollarSign, Globe } from "lucide-react";
import DualPrice from "@/components/DualPrice";

const cards = [
  {
    Icon: Zap,
    title: "Competitive Energy",
    text: "Saudi energy rates from $0.048/kWh. Your compute costs drop before we even optimize.",
    hasPrice: true,
  },
  {
    Icon: ShieldCheck,
    title: "Data Sovereignty",
    text: "SDAIA & NDMO compliant. Government-grade data residency. Your data never leaves the Kingdom.",
  },
  {
    Icon: Cpu,
    title: "Hardware Agnostic",
    text: "GPUs, CPUs, storage — any hardware, any vendor. Not locked to one chip maker.",
  },
  {
    Icon: Layers,
    title: "Security by Design",
    text: "3-agent security model. Zero direct connections. Firecracker micro-VM isolation. End-to-end encrypted.",
  },
  {
    Icon: DollarSign,
    title: "Market Maker Pricing",
    text: "We set fair prices both sides. Providers get guaranteed rates. Renters get transparent pricing.",
  },
  {
    Icon: Globe,
    title: "Saudi-First, Global Reach",
    text: "Built in the Kingdom for the world. Regulatory moat meets global demand.",
  },
];

const AdvantagesSection = () => {
  return (
    <section id="advantages" className="bg-card py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          The DC1 <span className="text-primary">Advantage</span>
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
