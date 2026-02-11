import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useGPUDetection } from "@/contexts/GPUContext";

const EarningsCalculatorSection = () => {
  const { isKnown, earnings, comparison, utilization, setUtilization } = useGPUDetection();

  if (!isKnown || !earnings || !comparison) return null;

  return (
    <section id="earnings-calculator" className="bg-background py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          {/* Earnings Card */}
          <div className="relative rounded-2xl border border-border bg-card p-7 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-green-500" />
            <p className="text-xs uppercase tracking-[1.5px] text-muted-foreground mb-4">
              Your Estimated Earnings
            </p>

            <div className="my-5">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Utilization</span>
                <span className="text-xs font-semibold text-primary">{utilization}%</span>
              </div>
              <Slider
                value={[utilization]}
                onValueChange={(v) => setUtilization(v[0])}
                min={20} max={100} step={1}
              />
            </div>

            <div className="text-center py-5">
              <p className="text-5xl font-extrabold bg-gradient-to-br from-green-400 to-green-500 bg-clip-text text-transparent leading-tight">
                ${Math.round(earnings.monthlyEarning)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">estimated monthly earnings</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Market Rate/hr" value={`$${earnings.marketPrice.toFixed(2)}`} />
              <StatBox label="Your Cut (85%)" value={`$${earnings.yourCut.toFixed(3)}`} />
              <StatBox label="Power Cost/hr" value={`-$${earnings.hourlyPowerCost.toFixed(3)}`} />
            </div>
          </div>

          {/* Comparison Card */}
          <div className="relative rounded-2xl border border-border bg-card p-7 overflow-hidden mt-5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-green-500" />
            <p className="text-xs uppercase tracking-[1.5px] text-muted-foreground mb-4">
              DC1 vs Hosting Elsewhere
            </p>

            <div className="flex h-9 rounded-lg overflow-hidden my-3">
              <div className="bg-green-500 flex items-center justify-center text-xs font-bold text-black" style={{ width: `${comparison.energyBarPct}%` }}>
                DC1: $0.048/kWh
              </div>
              <div className="bg-red-500/70 flex items-center justify-center text-xs font-bold text-white" style={{ width: `${100 - comparison.energyBarPct}%` }}>
                Global avg: $0.12/kWh
              </div>
            </div>

            <CompRow platform="DC1 (Saudi Energy)" tag="BEST" net={comparison.dc1.net} power={comparison.dc1.power} highlight />
            <CompRow platform="vast.ai (US energy)" net={comparison.us.net} power={comparison.us.power} />
            <CompRow platform="Self-host (Dubai energy)" net={comparison.dubai.net} power={comparison.dubai.power} />
            <CompRow platform="Self-host (EU energy)" net={comparison.eu.net} power={comparison.eu.power} noBorder />

            <div className="mt-4 text-center rounded-lg bg-green-500/10 p-3">
              <span className="text-sm font-semibold text-green-400">
                DC1 earns you ${Math.round(comparison.dc1.net - comparison.us.net)}/mo more than US-based hosting
              </span>
            </div>
          </div>

          {/* CTA to scroll to signup */}
          <div className="text-center mt-8">
            <a
              href="#early-access"
              className="inline-block rounded-lg bg-green-500 px-10 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              Start Earning — Join Below
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3.5 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function CompRow({ platform, tag, net, power, highlight, noBorder }: {
  platform: string; tag?: string; net: number; power: number; highlight?: boolean; noBorder?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center py-3.5 ${noBorder ? "" : "border-b border-border"}`}>
      <div className="font-medium text-sm">
        {highlight ? "🟢" : "⚪"} {platform}
        {tag && <span className="ml-2 inline-block bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-[11px] font-semibold">{tag}</span>}
      </div>
      <div className="text-right">
        <p className={`font-semibold ${highlight ? "text-green-400" : ""}`}>${Math.round(net)}/mo</p>
        <p className="text-xs text-muted-foreground">Power: ${Math.round(power)}/mo</p>
      </div>
    </div>
  );
}

export default EarningsCalculatorSection;
