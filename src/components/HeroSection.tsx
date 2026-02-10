import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-datacenter.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Datacenter infrastructure" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-radial-fade" />

      <div className="container relative mx-auto px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-medium text-primary">All Systems Operational</span>
          </div>

          <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Enterprise{" "}
            <span className="text-gradient">Infrastructure</span>
            <br />
            Built for Scale
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tier IV certified datacenters with 99.999% uptime guarantee. Deploy globally with sub-millisecond latency and military-grade security.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--glow-strong)]">
              Deploy Now
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary">
              View Infrastructure
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {[
            { value: "99.999%", label: "Uptime SLA" },
            { value: "28", label: "Global Locations" },
            { value: "<1ms", label: "Network Latency" },
            { value: "50K+", label: "Servers Deployed" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
              <div className="font-mono text-2xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
