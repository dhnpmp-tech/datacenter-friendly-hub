import { useEffect } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useGPUDetection } from "@/contexts/GPUContext";
import { GPU_SELECT_OPTIONS } from "@/lib/gpu-data";


const stats = [
  { value: "12", label: "Providers" },
  { value: "48", label: "GPUs" },
  { value: "$0.35/hr", label: "Avg Cost" },
  { value: "99.9%", label: "Uptime" },
];

const HeroSection = () => {
  const { detecting, detectedGPU, isKnown, earnings, gpuDisplayName, selectGPU } = useGPUDetection();

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  const handleCtaClick = (cta: string) => {
    trackEvent("cta_click", { cta });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="container relative mx-auto px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Power, Digitalized
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The decentralized compute marketplace built on Saudi Arabia's most competitive energy.
          </p>

          {/* GPU Detection Banner */}
          {!detecting && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 w-full max-w-lg"
            >
              {isKnown && earnings ? (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-4">
                  <p className="text-sm text-green-400">
                    We detected your <span className="font-bold text-white">{gpuDisplayName}</span> — you could earn{" "}
                    <span className="font-bold text-green-300">${Math.round(earnings.monthlyEarning)}/mo</span>
                  </p>
                  <a
                    href="#earnings-calculator"
                    onClick={() => handleCtaClick("see_your_earnings")}
                    className="mt-3 inline-block rounded-lg bg-green-500 px-6 py-2 text-sm font-bold text-black transition-all hover:brightness-110"
                  >
                    See Your Earnings
                  </a>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-3">Select your GPU to see earnings</p>
                  <select
                    className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                    onChange={(e) => { selectGPU(e.target.value); handleCtaClick("manual_gpu_select"); }}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose your GPU...</option>
                    {GPU_SELECT_OPTIONS.map(g => (
                      <option key={g} value={g}>NVIDIA {g}</option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#early-access"
              onClick={() => handleCtaClick("i_have_hardware")}
              className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(37_91%_55%/0.3)]"
            >
              I Have Hardware
            </a>
            <a
              href="#early-access"
              onClick={() => handleCtaClick("i_need_compute")}
              className="rounded-lg border border-primary/50 px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              I Need Compute
            </a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="grid grid-cols-2 gap-px rounded-xl border border-border/60 bg-border/30 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-1 bg-background px-6 py-5 ${
                  i === 0 ? "rounded-tl-xl sm:rounded-l-xl sm:rounded-tr-none" : ""
                }${i === 1 ? "rounded-tr-xl sm:rounded-none" : ""}${
                  i === 2 ? "rounded-bl-xl sm:rounded-none" : ""
                }${i === 3 ? "rounded-br-xl sm:rounded-r-xl sm:rounded-bl-none" : ""}`}
              >
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
