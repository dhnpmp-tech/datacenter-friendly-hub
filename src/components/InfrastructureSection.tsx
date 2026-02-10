import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "N+1 redundant power systems",
  "2N cooling architecture",
  "Multi-carrier fiber connectivity",
  "Biometric access controls",
  "24/7 on-site security personnel",
  "SOC 2 Type II certified",
  "HIPAA & PCI DSS compliant",
  "Seismically reinforced structures",
];

const InfrastructureSection = () => {
  return (
    <section id="infrastructure" className="relative py-32">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-sm font-medium text-primary">// INFRASTRUCTURE</p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
              Built for
              <br />
              <span className="text-gradient">Zero Downtime</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Our facilities are engineered to the highest standards of reliability, security, and efficiency.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-secondary-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Terminal-style card */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">system_status.sh</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-muted-foreground">$ nexus status --verbose</div>
                <div className="mt-3 text-green-400">✓ Power Systems: NOMINAL</div>
                <div className="text-green-400">✓ Cooling: OPTIMAL (18.2°C)</div>
                <div className="text-green-400">✓ Network: 99.999% UPTIME</div>
                <div className="text-green-400">✓ Security: ALL CLEAR</div>
                <div className="text-green-400">✓ Storage: 2.4PB AVAILABLE</div>
                <div className="mt-3 text-muted-foreground">
                  <span className="text-primary">→</span> All systems operational across 28 regions
                </div>
                <div className="mt-1 text-muted-foreground animate-pulse-glow">█</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
