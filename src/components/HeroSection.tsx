import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useGPUDetection } from "@/contexts/GPUContext";
import GPUDetectionBanner from "@/components/earn/GPUDetectionBanner";
import GPUManualSelector from "@/components/earn/GPUManualSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import DualPrice from "@/components/DualPrice";

const stats = [
  { value: "12", label: "Providers" },
  { value: "48", label: "GPUs" },
  { value: "$0.35/hr", label: "Avg Cost", usd: 0.35 },
  { value: "99.9%", label: "Uptime" },
];

const HeroSection = () => {
  const { detecting, detectedGPU, isKnown, isNonDiscrete, earnings, gpuDisplayName, selectGPU, rawRenderer, cleanGPUName } = useGPUDetection();
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [manualFocus, setManualFocus] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  const handleCtaClick = (cta: string) => {
    trackEvent("cta_click", { cta });
  };

  const handleSelectManually = () => {
    setShowManualSelector(true);
    setManualFocus(true);
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
              {/* Non-discrete GPU banner */}
              {isNonDiscrete && rawRenderer && !isKnown && (
                <GPUDetectionBanner
                  rawRenderer={cleanGPUName || rawRenderer}
                  onSelectManually={handleSelectManually}
                />
              )}

              {isKnown && earnings ? (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-4">
                  <p className="text-sm text-green-400">
                    We detected your <span className="font-bold text-white">{gpuDisplayName}</span> — you could earn{" "}
                    <span className="font-bold text-green-300">
                      <DualPrice usd={earnings.monthlyEarning} period="/mo" primaryClassName="text-green-300 font-bold" secondaryClassName="text-green-300/60" />
                    </span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <a
                      href="#earnings-calculator"
                      onClick={() => handleCtaClick("see_your_earnings")}
                      className="inline-block rounded-lg bg-green-500 px-6 py-2 text-sm font-bold text-black transition-all hover:brightness-110"
                    >
                      See Your Earnings
                    </a>
                    <button
                      onClick={handleSelectManually}
                      className="text-xs text-secondary hover:underline"
                    >
                      Not your GPU? Select manually →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-3">Select your GPU to see earnings</p>
                  <GPUManualSelector
                    currentGPU={detectedGPU || ""}
                    onSelect={(name) => { selectGPU(name); handleCtaClick("manual_gpu_select"); }}
                    autoFocus={manualFocus}
                  />
                </div>
              )}

              {/* Show manual selector below when user clicks "Not your GPU?" */}
              {isKnown && showManualSelector && (
                <div className="mt-3 rounded-xl border border-border bg-card px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-3">Select your actual GPU</p>
                  <GPUManualSelector
                    currentGPU={detectedGPU || ""}
                    onSelect={(name) => { selectGPU(name); handleCtaClick("manual_gpu_select"); setShowManualSelector(false); }}
                    autoFocus={manualFocus}
                  />
                </div>
              )}

              {/* Detection tip */}
              <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Info className="h-3 w-3 text-primary shrink-0" />
                For accurate detection, use Chrome or Edge with hardware acceleration enabled
              </p>
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
