import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to <span className="text-gradient">Scale</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Deploy your infrastructure in minutes. Talk to our solutions architects and get started today.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--glow-strong)]">
              Contact Sales
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary">
              View Pricing
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
