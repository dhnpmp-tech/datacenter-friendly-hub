import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import {
  GPU_DB, GPU_SELECT_OPTIONS, LOCATION_OPTIONS,
  detectGPU, matchGPU, getMarketPrice, calcEarnings, calcComparison,
  type GPUInfo, type LiveGPUData,
} from "@/lib/gpu-data";

const tierBadge: Record<string, { label: string; className: string }> = {
  high: { label: "High Demand", className: "bg-success/20 text-green-400 border border-green-500" },
  mid: { label: "Good Earner", className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500" },
  low: { label: "Marketplace Ready", className: "bg-red-500/15 text-red-400 border border-red-500" },
};

const Earn = () => {
  const { toast } = useToast();

  // Detection state
  const [detecting, setDetecting] = useState(true);
  const [detectedGPU, setDetectedGPU] = useState<string | null>(null);
  const [rawRenderer, setRawRenderer] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [detectionMsg, setDetectionMsg] = useState<string | null>(null);

  // Data
  const [liveData, setLiveData] = useState<LiveGPUData | null>(null);
  const [marketPrice, setMarketPrice] = useState(0);
  const [utilization, setUtilization] = useState(60);

  // Form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLocation, setFormLocation] = useState("SA");
  const [formGpuCount, setFormGpuCount] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const gpuInfo: GPUInfo | undefined = detectedGPU ? GPU_DB[detectedGPU] : undefined;
  const isKnown = !!gpuInfo;

  const earnings = isKnown ? calcEarnings(detectedGPU!, marketPrice, utilization / 100) : null;
  const comparison = isKnown ? calcComparison(detectedGPU!, marketPrice, utilization / 100) : null;

  // Fetch live market data + detect GPU on mount
  useEffect(() => {
    (async () => {
      let live: LiveGPUData | null = null;
      try {
        const resp = await fetch("https://500.farm/vastai-exporter/gpu-stats");
        live = await resp.json();
        setLiveData(live);
      } catch {
        console.log("Using fallback prices");
      }

      const detection = detectGPU();
      if (detection) {
        const matched = matchGPU(detection.renderer);
        if (matched && GPU_DB[matched]) {
          setDetectedGPU(matched);
          setRawRenderer(detection.renderer);
          setMarketPrice(getMarketPrice(matched, live));
        } else if (matched) {
          setDetectedGPU(matched);
          setRawRenderer(detection.renderer);
          setShowManual(true);
        } else {
          setDetectionMsg(`Detected: ${detection.renderer || "Unknown"}`);
          setShowManual(true);
        }
      } else {
        setDetectionMsg("Could not auto-detect GPU (WebGL blocked)");
        setShowManual(true);
      }
      setDetecting(false);
    })();
  }, []);

  const selectGPU = useCallback((name: string) => {
    if (name === "other") {
      setDetectedGPU("other");
      return;
    }
    setDetectedGPU(name);
    setRawRenderer(null);
    setShowManual(false);
    setMarketPrice(getMarketPrice(name, liveData));
  }, [liveData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const gpu = isKnown ? `NVIDIA ${detectedGPU}` : (rawRenderer || detectedGPU || "Other");

    // Check duplicate
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("email", formEmail);

    if (count && count > 0) {
      toast({ title: "Already registered", description: "This email is already on our waitlist.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("waitlist").insert([{
      type: "provider",
      full_name: formName,
      email: formEmail,
      location_city: formLocation,
      gpu_models: gpu,
      num_units: parseInt(formGpuCount) || 1,
      message: earnings ? `Est. monthly: $${Math.round(earnings.monthlyEarning)}` : null,
    }]);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    await trackEvent("form_submit", { type: "provider", email: formEmail, source: "earn_page" });
    setSubmitted(true);
    setSubmitting(false);
  };

  const gpuDisplayName = isKnown ? `NVIDIA ${detectedGPU}` : (rawRenderer || detectedGPU || "");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground">
      <div className="mx-auto max-w-[720px] px-4 py-6">
        {/* Header */}
        <header className="text-center pt-10 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            DC<span className="text-primary">1</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn your idle GPU into income — powered by Saudi Arabia's competitive energy
          </p>
        </header>

        {/* GPU Detection Card */}
        <Card title="Your Hardware" icon="🔍">
          {detecting ? (
            <div className="flex items-center gap-3 py-5">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Detecting your GPU...</span>
            </div>
          ) : detectedGPU && detectedGPU !== "other" ? (
            <div>
              <p className="text-2xl font-bold text-white">{gpuDisplayName}</p>
              {gpuInfo && (
                <>
                  <p className="text-sm text-muted-foreground">{gpuInfo.vram}GB VRAM · {gpuInfo.tdp}W TDP</p>
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${tierBadge[gpuInfo.tier].className}`}>
                    {tierBadge[gpuInfo.tier].label}
                  </span>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SpecItem label="GPU Cores" value={gpuInfo.cores} />
                    <SpecItem label="Platform" value={navigator.platform || "Unknown"} />
                  </div>
                </>
              )}
            </div>
          ) : (
            detectionMsg && <p className="text-sm text-muted-foreground py-2">{detectionMsg}</p>
          )}

          {showManual && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">
                {detectedGPU ? "Select your exact GPU:" : "Couldn't auto-detect. Select your GPU:"}
              </p>
              <select
                className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                onChange={(e) => selectGPU(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Choose your GPU...</option>
                {GPU_SELECT_OPTIONS.map(g => (
                  <option key={g} value={g}>NVIDIA {g}</option>
                ))}
                <option value="other">Other / Not Listed</option>
              </select>
            </div>
          )}
        </Card>

        {/* Earnings Calculator */}
        {isKnown && earnings && (
          <Card title="Your Estimated Earnings" icon="💰">
            <div className="my-5">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Utilization</span>
                <span className="text-xs font-semibold text-primary">{utilization}%</span>
              </div>
              <Slider
                value={[utilization]}
                onValueChange={(v) => setUtilization(v[0])}
                min={20}
                max={100}
                step={1}
              />
            </div>

            <div className="text-center py-5">
              <p className="text-5xl font-extrabold bg-gradient-to-br from-green-400 to-green-500 bg-clip-text text-transparent leading-tight">
                ${Math.round(earnings.monthlyEarning)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">estimated monthly earnings</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <StatBox label="Market Rate/hr" value={`$${earnings.marketPrice.toFixed(2)}`} />
              <StatBox label="Your Cut (85%)" value={`$${earnings.yourCut.toFixed(3)}`} />
              <StatBox label="Power Cost/hr" value={`-$${earnings.hourlyPowerCost.toFixed(3)}`} />
            </div>
          </Card>
        )}

        {/* DC1 vs Others */}
        {isKnown && comparison && (
          <Card title="DC1 vs Hosting Elsewhere" icon="⚡">
            {/* Energy bar */}
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
          </Card>
        )}

        {/* Signup Form */}
        {(detectedGPU || showManual) && (
          <Card title="Start Earning — Join the Waitlist" icon="🚀">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Name</label>
                    <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
                    <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="you@email.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Location</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                    >
                      {LOCATION_OPTIONS.map(l => (
                        <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Detected GPU</label>
                    <Input value={gpuDisplayName || "Other"} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">How many GPUs do you have?</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formGpuCount}
                    onChange={e => setFormGpuCount(e.target.value)}
                  >
                    <option value="1">1 GPU</option>
                    <option value="2-4">2-4 GPUs</option>
                    <option value="5-10">5-10 GPUs</option>
                    <option value="10+">10+ GPUs</option>
                  </select>
                </div>
                <div className="text-center pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full max-w-[400px] py-6 text-base font-bold bg-gradient-to-r from-primary to-amber-400 hover:brightness-110 transition-all"
                  >
                    {submitting ? "Submitting..." : "Join Provider Waitlist →"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Free to join. No commitment. We'll notify you when DC1 launches.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-5xl">🎉</p>
                <p className="text-xl font-bold mt-3">You're on the list!</p>
                <p className="text-muted-foreground mt-2">We'll email you when DC1 launches in your region.</p>
              </div>
            )}
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
          Market data from vast.ai — updated live
          <br />
          <span className="mt-2 inline-block">© 2026 DC1 — Saudi Arabia's Compute Marketplace</span>
        </footer>
      </div>
    </div>
  );
};

// --- Sub-components ---

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-border bg-card p-7 mb-5 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-green-500" />
      <p className="text-xs uppercase tracking-[1.5px] text-muted-foreground mb-4">
        {icon} {title}
      </p>
      {children}
    </motion.div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3.5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

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

export default Earn;
