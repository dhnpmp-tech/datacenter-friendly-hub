import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import EarningsReport from "@/components/EarningsReport";
import GPUDetectionBanner from "@/components/earn/GPUDetectionBanner";
import GPUManualSelector from "@/components/earn/GPUManualSelector";
import DualPrice from "@/components/DualPrice";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { getPersistedGPU, persistGPU } from "@/lib/gpu-persist";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t, lang } = useLanguage();

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
  const [showRawDetails, setShowRawDetails] = useState(false);
  const [autoMatched, setAutoMatched] = useState(false);
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

  // Detect GPU on mount (check localStorage first)
  useEffect(() => {
    const persisted = getPersistedGPU();
    if (persisted) {
      setDetectedGPU(persisted);
      setSelectedDropdown(persisted);
    }

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
          // If we have a persisted selection, don't force manual
          if (!persisted) setShowManual(true);
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
            if (!persisted) {
              setDetectedGPU(autoMatch);
              setSelectedDropdown(autoMatch);
              setAutoMatched(true);
            }
            setDetecting(false);
            return;
          }
        }

        // Fallback to old matchGPU logic
        const matched = matchGPU(detection.renderer);
        if (matched && GPU_DB[matched]) {
          if (!persisted) {
            setDetectedGPU(matched);
            setSelectedDropdown(matched);
            setAutoMatched(true);
          }
        } else {
          // Discrete but not in our list
          setDetectionMsg(parsed?.clean || detection.renderer);
          if (!persisted) setShowManual(true);
        }
      } else {
        setDetectionMsg("Could not auto-detect GPU (WebGL blocked)");
        setIsNonDiscrete(true);
        if (!persisted) setShowManual(true);
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
    setAutoMatched(false);
    persistGPU(name);
  }, []);

  const scrollToManual = () => {
    setShowManual(true);
    setManualSelectorFocus(true);
    setTimeout(() => manualRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

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
        <header className="flex items-center justify-between pt-6 pb-2">
          <div />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>
        </header>
        <div className="text-center pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            DC<span className="text-primary">1</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("earn.subtitle")}
          </p>
        </div>

        {/* Non-discrete GPU banner */}
        {!detecting && isNonDiscrete && rawRenderer && isKnown && (
          <GPUDetectionBanner rawRenderer={cleanGPUName || rawRenderer} onSelectManually={scrollToManual} />
        )}

        {/* GPU Detection Card */}
        <Card title={t("earn.your_hardware")} icon="🔍">
          {detecting ? (
            <div className="flex items-center gap-3 py-5">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">{t("earn.detecting")}</span>
            </div>
          ) : detectedGPU && detectedGPU !== "other" && isKnown ? (
            <div>
              {/* Clean GPU name */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <p className="text-2xl font-bold text-foreground">
                  {cleanGPUName || `NVIDIA ${detectedGPU}`}
                </p>
              </div>

              {/* Specs subtitle */}
              {gpuInfo && (
                <p className="text-sm text-muted-foreground mt-1.5">
                  {gpuInfo.vram}GB VRAM · {gpuInfo.tdp}W TDP
                </p>
              )}

              {/* Auto-matched badge */}
              {autoMatched && (
                <p className="text-xs text-green-400/80 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {t("earn.auto_matched")}
                </p>
              )}

              {/* Raw details toggle */}
              {rawRenderer && (
                <button
                  onClick={() => setShowRawDetails(!showRawDetails)}
                  className="mt-2 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${showRawDetails ? "rotate-180" : ""}`} />
                  {showRawDetails ? t("earn.hide_raw") : t("earn.show_raw")}
                </button>
              )}
              {showRawDetails && rawRenderer && (
                <p className="text-[11px] text-muted-foreground/50 mt-1 break-all font-mono leading-relaxed">
                  {rawRenderer}
                </p>
              )}

              {/* Earnings preview */}
              {gpuInfo && (
                <>
                  <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
                    <p className="text-sm text-green-400">
                      {t("earn.estimated_earnings")}{" "}
                      <span className="font-bold">
                        <DualPrice
                          usd={gpuInfo.rate * gpuInfo.utilization * 0.85}
                          period="/hr"
                          primaryClassName="text-green-300 font-bold"
                          secondaryClassName="text-green-400/60"
                        />
                      </span>
                    </p>
                  </div>

                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${tierBadge[gpuInfo.tier].className}`}>
                    {tierBadge[gpuInfo.tier].label}
                  </span>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SpecItem label="GPU Cores" value={gpuInfo.cores} />
                    <SpecItem label="Platform" value={navigator.platform || "Unknown"} />
                  </div>
                </>
              )}

              {/* Manual override link */}
              <button
                onClick={scrollToManual}
                className="mt-4 text-xs text-secondary hover:underline"
              >
                {t("earn.not_your_gpu")}
              </button>
            </div>
          ) : (
            <>
              {/* Non-discrete banner when no GPU selected yet */}
              {isNonDiscrete && rawRenderer && (
                <GPUDetectionBanner rawRenderer={cleanGPUName || rawRenderer} onSelectManually={() => setManualSelectorFocus(true)} />
              )}
              {detectionMsg && !isNonDiscrete && (
                <div className="flex items-start gap-2 py-2">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{detectionMsg}</p>
                </div>
              )}
            </>
          )}

          {/* Searchable GPU selector — prominent when detection fails */}
          {(showManual || (!isKnown && !detecting)) && (
            <div className="mt-4" ref={manualRef}>
              <p className="text-sm font-medium text-foreground mb-3">
                {t("earn.select_gpu")}
              </p>
              <GPUManualSelector
                currentGPU={selectedDropdown}
                onSelect={selectGPU}
                autoFocus={manualSelectorFocus}
              />
            </div>
          )}

          {/* Tip for accurate detection */}
          <p className="mt-4 text-xs text-muted-foreground flex items-start gap-1.5">
            <Info className="h-3 w-3 text-primary mt-0.5 shrink-0" />
            {t("earn.detection_tip")}
          </p>
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
            <span className="text-xs text-muted-foreground whitespace-nowrap">{t("earn.like_what_you_see")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Signup Form */}
        {(detectedGPU || showManual) && (
          <Card title={t("earn.join_waitlist")} icon="🚀">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{t("earn.name")}</label>
                    <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder={t("placeholder.your_name")} required />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{t("earn.email")}</label>
                    <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder={t("placeholder.email")} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{t("earn.location")}</label>
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
                    <label className="block text-xs text-muted-foreground mb-1.5">{t("earn.detected_gpu")}</label>
                    <Input value={isKnown ? (cleanGPUName || `NVIDIA ${detectedGPU}`) : (gpuDisplayName || "Other")} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t("earn.gpu_count")}</label>
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
                    {submitting ? t("waitlist.submitting") : t("earn.join_provider")}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    {t("earn.free_to_join")}
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-5xl">🎉</p>
                <p className="text-xl font-bold mt-3">{t("earn.on_the_list")}</p>
                <p className="text-muted-foreground mt-2">{t("earn.will_email")}</p>
              </div>
            )}
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center py-8 space-y-2">
          <p className="text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse align-middle" />
            {t("earn.market_data")}
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            {t("footer.legal")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <a href="https://x.com/DC1sa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors" aria-label="X">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/dc1sa/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://dc1st.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors">dc1st.com</a>
          </div>
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
      className="relative rounded-2xl border border-border bg-card p-7 mb-5"
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
