import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import EarningsReport from "@/components/EarningsReport";
import GPUDetectionBanner from "@/components/earn/GPUDetectionBanner";
import GPUManualSelector, { getPersistedGPU, persistGPU } from "@/components/earn/GPUManualSelector";
import {
  GPU_DB, GPU_SELECT_OPTIONS, LOCATION_OPTIONS,
  detectGPU, matchGPU,
  parseGPUName, getNonDiscreteMessage, autoMatchDropdown,
  type GPUInfo,
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
  const [cleanGPUName, setCleanGPUName] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [detectionMsg, setDetectionMsg] = useState<string | null>(null);
  const [isNonDiscrete, setIsNonDiscrete] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [manualSelectorFocus, setManualSelectorFocus] = useState(false);
  const manualRef = useRef<HTMLDivElement>(null);

  // Form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLocation, setFormLocation] = useState("SA");
  const [formGpuCount, setFormGpuCount] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const gpuInfo: GPUInfo | undefined = detectedGPU ? GPU_DB[detectedGPU] : undefined;
  const isKnown = !!gpuInfo;

  // Detect GPU on mount
  useEffect(() => {
    (async () => {
      const detection = detectGPU();
      if (detection) {
        setRawRenderer(detection.renderer);

        // Check for non-discrete GPU first
        const nonDiscreteMsg = getNonDiscreteMessage(detection.renderer);
        if (nonDiscreteMsg) {
          setDetectionMsg(nonDiscreteMsg);
          setIsNonDiscrete(true);
          const parsed = parseGPUName(detection.renderer);
          if (parsed) setCleanGPUName(parsed.clean);
          setShowManual(true);
          setDetecting(false);
          return;
        }

        // Parse the clean name from raw WebGL string
        const parsed = parseGPUName(detection.renderer);
        if (parsed) {
          setCleanGPUName(parsed.clean);

          // Try to auto-match to dropdown
          const autoMatch = autoMatchDropdown(parsed.clean);
          if (autoMatch && GPU_DB[autoMatch]) {
            setDetectedGPU(autoMatch);
            setSelectedDropdown(autoMatch);
            setDetecting(false);
            return;
          }
        }

        // Fallback to old matchGPU logic
        const matched = matchGPU(detection.renderer);
        if (matched && GPU_DB[matched]) {
          setDetectedGPU(matched);
          setSelectedDropdown(matched);
        } else {
          // Discrete but not in our list
          setDetectionMsg(parsed?.clean || detection.renderer);
          setShowManual(true);
        }
      } else {
        setDetectionMsg("Could not auto-detect GPU (WebGL blocked)");
        setIsNonDiscrete(true);
        setShowManual(true);
      }
      setDetecting(false);
    })();
  }, []);

  const selectGPU = useCallback((name: string) => {
    if (name === "other") {
      setDetectedGPU("other");
      setSelectedDropdown("other");
      return;
    }
    setDetectedGPU(name);
    setSelectedDropdown(name);
    setRawRenderer(null);
    setShowManual(false);
    setDetectionMsg(null);
  }, []);

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

    const insertData = {
      type: "provider" as const,
      full_name: formName,
      email: formEmail,
      location_city: formLocation,
      gpu_models: gpu,
      num_units: parseInt(formGpuCount) || 1,
      message: gpuInfo ? `GPU: ${detectedGPU}, Rate: $${gpuInfo.rate}/hr` : null,
    };

    const { error } = await supabase.from("waitlist").insert([insertData]);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Notify via edge function (fire-and-forget)
    supabase.functions.invoke("notify-signup", { body: { record: insertData } }).catch(console.error);

    await trackEvent("form_submit", { type: "provider", email: formEmail, source: "earn_page" });
    setSubmitted(true);
    setSubmitting(false);
  };

  const gpuDisplayName = isKnown ? detectedGPU! : (rawRenderer || detectedGPU || "");

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
          ) : detectedGPU && detectedGPU !== "other" && isKnown ? (
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <p className="text-2xl font-bold text-foreground">{cleanGPUName || `NVIDIA ${detectedGPU}`}</p>
              </div>
              {rawRenderer && rawRenderer !== cleanGPUName && (
                <p className="text-xs text-muted-foreground mt-1.5 break-all">Raw: {rawRenderer}</p>
              )}
              {gpuInfo && (
                <>
                  <p className="text-sm text-muted-foreground mt-2">{gpuInfo.vram}GB VRAM · {gpuInfo.tdp}W TDP</p>
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
            <>
              {detectionMsg && (
                <div className="flex items-start gap-2 py-2">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{detectionMsg}</p>
                </div>
              )}
              {rawRenderer && isNonDiscrete && (
                <p className="text-xs text-muted-foreground mt-1 break-all">Raw: {rawRenderer}</p>
              )}
            </>
          )}

          {/* Dropdown — prominent when detection fails */}
          {(showManual || (!isKnown && !detecting)) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-3">
                Select your GPU to see your earnings estimate
              </p>
              <select
                className={`w-full rounded-lg border bg-muted px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${
                  isNonDiscrete ? "border-primary/50 animate-pulse-border text-base" : "border-border"
                }`}
                onChange={(e) => selectGPU(e.target.value)}
                value={selectedDropdown}
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

        {/* Earnings Report */}
        {isKnown && detectedGPU && (
          <EarningsReport
            gpuName={detectedGPU}
            gpuCount={parseInt(formGpuCount) || 1}
            onCountryDetected={(code) => {
              const match = LOCATION_OPTIONS.find(l => l.value === code);
              if (match) setFormLocation(match.value);
            }}
          />
        )}

        {/* Connector */}
        {isKnown && (
          <div className="flex items-center gap-4 my-2 px-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Like what you see?</span>
            <div className="flex-1 h-px bg-border" />
          </div>
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

export default Earn;
