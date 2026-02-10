import { motion } from "framer-motion";
import { Server, Shield, Globe, Zap, HardDrive, Cpu } from "lucide-react";

const services = [
  {
    icon: Server,
    title: "Colocation",
    description: "Secure rack space with redundant power, cooling, and connectivity in Tier IV facilities.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Multi-layered defense with 10Tbps+ mitigation capacity and real-time threat intelligence.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Edge network spanning 28 locations for ultra-low latency content delivery worldwide.",
  },
  {
    icon: Zap,
    title: "Bare Metal",
    description: "Dedicated high-performance servers with custom configurations and instant provisioning.",
  },
  {
    icon: HardDrive,
    title: "Cloud Storage",
    description: "S3-compatible object storage with 11 nines durability and geo-redundant replication.",
  },
  {
    icon: Cpu,
    title: "GPU Clusters",
    description: "NVIDIA H100 and A100 clusters for AI/ML workloads with InfiniBand interconnects.",
  },
];

const ServicesSection = () => {
  return (
    <section id="solutions" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-sm font-medium text-primary">// SOLUTIONS</p>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Infrastructure as a Service
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            End-to-end datacenter solutions engineered for enterprise reliability and performance.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-lg border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--glow-primary)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                <service.icon size={20} />
              </div>
              <h3 className="font-mono text-base font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
