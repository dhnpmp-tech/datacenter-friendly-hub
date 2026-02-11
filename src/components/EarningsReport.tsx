import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, RotateCcw, Zap, Shield, CheckCircle, Lock, Server } from "lucide-react";
import {
  GPU_DB, ENERGY_BY_COUNTRY, DEFAULT_ENERGY_RATE,
  type GPUInfo,
} from "@/lib/gpu-data";

interface EarningsReportProps {
  gpuName: string;
  gpuCount?: number;
  onCountryDetected?: (countryCode: string) => void;
}

const MONTHLY_HOURS = 730;
const DC1_ENERGY = 0.048;
const DC1_FEE_PCT = 0.15;
const OVERHEAD = 1.3;

const COUNTRY_FLAGS: Record<string, string> = {
  SA: '\u{1F1F8}\u{1F1E6}', AE: '\u{1F1E6}\u{1F1EA}', US: '\u{1F1FA}\u{1F1F8}',
  GB: '\u{1F1EC}\u{1F1E7}', DE: '\u{1F1E9}\u{1F1EA}', FR: '\u{1F1EB}\u{1F1F7}',
  NL: '\u{1F1F3}\u{1F1F1}', CA: '\u{1F1E8}\u{1F1E6}', AU: '\u{1F1E6}\u{1F1FA}',
  JP: '\u{1F1EF}\u{1F1F5}', KR: '\u{1F1F0}\u{1F1F7}', IN: '\u{1F1EE}\u{1F1F3}',
  BR: '\u{1F1E7}\u{1F1F7}', TR: '\u{1F1F9}\u{1F1F7}', EG: '\u{1F1EA}\u{1F1EC}',
  BH: '\u{1F1E7}\u{1F1ED}', QA: '\u{1F1F6}\u{1F1E6}', KW: '\u{1F1F0}\u{1F1FC}',
  OM: '\u{1F1F4}\u{1F1F2}',
};

function useAnimatedNumber(target: number, duration = 300) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) { setValue(target); prev.current = target; return; }
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + diff * eased;
      setValue(current);
      if (t < 1) requestAnimationFrame(step);
      else prev.current = target;
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

const EarningsReport = ({ gpuName, gpuCount = 1, onCountryDetected }: EarningsReportProps) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLabel, setCountryLabel] = useState("Detecting...");
  const [userEnergyRate, setUserEnergyRate] = useState<number>(DEFAULT_ENERGY_RATE);
  const [autoRate, setAutoRate] = useState<number>(DEFAULT_ENERGY_RATE);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isCustomRate, setIsCustomRate] = useState(false);

  const gpu = GPU_DB[gpuName];

  useEffect(() => {
    if (!gpu) return;
    (async () => {
      try {
        const resp = await fetch("https://ip-api.com/json/?fields=countryCode,country");
        const data = await resp.json();
        const code = data.countryCode as string;
        setCountryCode(code);
        onCountryDetected?.(code);
        const entry = ENERGY_BY_COUNTRY[code];
        if (entry) {
          setUserEnergyRate(entry.rate);
          setAutoRate(entry.rate);
          setCountryLabel(entry.label);
        } else {
          setUserEnergyRate(DEFAULT_ENERGY_RATE);
          setAutoRate(DEFAULT_ENERGY_RATE);
          setCountryLabel(data.country || "Other");
        }
      } catch {
        setCountryCode(null);
        setCountryLabel("Unknown");
        setUserEnergyRate(DEFAULT_ENERGY_RATE);
        setAutoRate(DEFAULT_ENERGY_RATE);
      }
    })();
  }, [gpu]);

  if (!gpu) return null;

  const rate = gpu.rate;
  const util = gpu.utilization;
  const tdpKw = gpu.tdp / 1000;
  const systemKw = tdpKw * OVERHEAD;

  // Revenue
  const grossMonthly = rate * util * MONTHLY_HOURS;
  const revenueForProvider = grossMonthly * 0.85;
  const revenueHourly = rate * util * 0.85;

  // Power costs
  const powerHourlyUser = systemKw * userEnergyRate;
  const powerMonthlyUser = systemKw * MONTHLY_HOURS * userEnergyRate;
  const powerHourlyDC1 = systemKw * DC1_ENERGY;
  const powerMonthlyDC1 = systemKw * MONTHLY_HOURS * DC1_ENERGY;

  // DC1 fee
  const dc1Fee = grossMonthly * DC1_FEE_PCT;

  // Net
  const netUser = revenueForProvider - powerMonthlyUser;
  const netDC1 = revenueForProvider - powerMonthlyDC1 - dc1Fee;
  const annualUser = netUser * 12;
  const annualDC1 = netDC1 * 12;

  // Condition logic
  const pctDiff = netUser !== 0 ? ((netDC1 - netUser) / Math.abs(netUser)) * 100 : 0;
  const bothNegative = netUser < 0 && netDC1 < 0;
  const userNegDC1Pos = netUser < 0 && netDC1 > 0;
  const dc1Better10 = netDC1 > netUser * 1.1 && !bothNegative && !userNegDC1Pos;
  const withinRange = !bothNegative && !userNegDC1Pos && !dc1Better10 && netDC1 >= netUser;
  const dc1Worse = !bothNegative && !userNegDC1Pos && netDC1 < netUser;
  const showPlatformValue = withinRange || dc1Worse;

  const flag = countryCode ? COUNTRY_FLAGS[countryCode] || "" : "";

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1000) return `$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (abs >= 10) return `$${abs.toFixed(0)}`;
    return `$${abs.toFixed(2)}`;
  };
  const fmtSigned = (n: number) => n < 0 ? `-${fmt(n)}` : fmt(n);

  const handleEditSave = () => {
    const v = parseFloat(editValue);
    if (!isNaN(v) && v > 0 && v < 2) {
      setUserEnergyRate(v);
      setIsCustomRate(true);
    }
    setEditing(false);
  };

  const handleReset = () => {
    setUserEnergyRate(autoRate);
    setIsCustomRate(false);
  };

  // Animated values
  const animRevHourly = useAnimatedNumber(revenueHourly * gpuCount);
  const animRevMonthly = useAnimatedNumber(revenueForProvider * gpuCount);
  const animPwrHourly = useAnimatedNumber(powerHourlyUser * gpuCount);
  const animPwrMonthly = useAnimatedNumber(powerMonthlyUser * gpuCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-border/50 overflow-hidden mb-5"
      style={{ backgroundColor: "hsl(222 47% 9%)" }}
    >
      {/* Card Header */}
      <div className="border-b border-border/50 px-6 py-3">
        <p className="text-[11px] uppercase tracking-[2px] text-muted-foreground font-medium">
          GPU Economics
        </p>
      </div>

      {/* SECTION 1 — Revenue & Power Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-border/50">
        {/* Revenue */}
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              ${animRevHourly.toFixed(3)}/hr
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
            ${animRevMonthly.toFixed(0)}/mo
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Market rate at {Math.round(util * 100)}% utilization
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            {gpu.tdp}W x 730hrs x {Math.round(util * 100)}% x ${rate.toFixed(2)}
          </p>
          {gpuCount > 1 && (
            <p className="text-[11px] text-muted-foreground mt-1">x {gpuCount} GPUs</p>
          )}
        </div>

        {/* Power Cost */}
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Power Cost</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: "hsl(0 84% 60% / 0.7)", fontVariantNumeric: "tabular-nums" }}>
              ${animPwrHourly.toFixed(3)}/hr
            </span>
          </div>
          <p className="text-lg font-semibold mt-1" style={{ color: "hsl(0 84% 60% / 0.7)", fontVariantNumeric: "tabular-nums" }}>
            ${animPwrMonthly.toFixed(0)}/mo
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {flag} {countryLabel}: ${userEnergyRate.toFixed(3)}/kWh
            {isCustomRate && <span className="text-muted-foreground/50"> (custom)</span>}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            {!editing && (
              <button
                onClick={() => { setEditing(true); setEditValue(userEnergyRate.toString()); }}
                className="text-[11px] text-secondary hover:underline inline-flex items-center gap-0.5"
              >
                <Pencil className="h-2.5 w-2.5" /> Edit your rate
              </button>
            )}
            {isCustomRate && !editing && (
              <button
                onClick={handleReset}
                className="text-[11px] text-muted-foreground hover:underline inline-flex items-center gap-0.5"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Reset
              </button>
            )}
          </div>
          {editing && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                step="0.001"
                min="0.01"
                max="1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 rounded border border-border bg-muted px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
              />
              <span className="text-[11px] text-muted-foreground">$/kWh</span>
              <button onClick={handleEditSave} className="text-[11px] font-medium text-secondary hover:underline">Save</button>
              <button onClick={() => setEditing(false)} className="text-[11px] text-muted-foreground hover:underline">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 — Net Profit Comparison */}
      <div className="border-b border-border/50 px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* User location column */}
          <div className="pr-0 sm:pr-5 sm:border-r border-border/30 pb-4 sm:pb-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Running from {flag} {countryLabel}
            </p>
            <ComparisonLines
              revenue={revenueForProvider * gpuCount}
              power={powerMonthlyUser * gpuCount}
              dc1Fee={null}
              net={netUser * gpuCount}
              annual={annualUser * gpuCount}
            />
          </div>

          {/* DC1 column */}
          <div className="pl-0 sm:pl-5 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/30">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Running on DC1 {COUNTRY_FLAGS.SA} Saudi Arabia
            </p>
            <ComparisonLines
              revenue={revenueForProvider * gpuCount}
              power={powerMonthlyDC1 * gpuCount}
              dc1Fee={dc1Fee * gpuCount}
              net={netDC1 * gpuCount}
              annual={annualDC1 * gpuCount}
            />
          </div>
        </div>

        {/* Conditional messages */}
        <div className="mt-5">
          {bothNegative && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <p className="text-sm text-yellow-400/90">
                At current market rates, this GPU may not generate positive returns from compute rental. Consider joining our waitlist — we'll notify you when demand for {gpuName} increases.
              </p>
            </div>
          )}
          {userNegDC1Pos && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
              <p className="text-sm" style={{ color: "hsl(var(--success))" }}>
                This GPU loses money at {countryLabel} energy rates. On DC1's Saudi energy, it becomes profitable.
              </p>
            </div>
          )}
          {dc1Better10 && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
              <p className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>
                DC1 Advantage: +{fmt(Math.abs((netDC1 - netUser) * gpuCount))}/mo (+{Math.round(Math.abs(pctDiff))}%) — lower energy costs offset the platform fee
              </p>
            </div>
          )}
          {withinRange && (
            <div className="rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Similar returns — but DC1 includes managed billing, security, compliance, and demand matching. No ops team needed.
              </p>
            </div>
          )}
          {dc1Worse && (
            <div className="rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                DC1 costs {fmt(Math.abs(netUser - netDC1) * gpuCount)}/mo — replacing your billing, security, compliance, networking, and customer support. No staff needed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — Platform Value (conditional) */}
      {showPlatformValue && (
        <div className="border-b border-border/50 px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            What the 15% platform fee includes
          </p>
          <div className="space-y-2.5">
            <ValueItem icon={Zap} text="Managed billing — we find renters, you get paid automatically" />
            <ValueItem icon={Shield} text="3-agent security model — Guardian, Watcher, Auditor protect your hardware" />
            <ValueItem icon={CheckCircle} text="SDAIA compliance — we handle Saudi regulatory requirements" />
            <ValueItem icon={Lock} text="Guaranteed rate — when rented, your rate is locked in" />
            <ValueItem icon={Server} text="Zero infrastructure — no networking, hosting, or support tickets to manage" />
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-4">
            DC1's 15% fee replaces your ops team.
          </p>
        </div>
      )}

      {/* Data Sources Footer */}
      <div className="px-6 py-3">
        <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
          Market rates: vast.ai global index (updated Feb 2026). Energy rates: IEA and SEC published tariffs.
          GPU power draw: manufacturer TDP specifications with 1.3x system overhead. Utilization: global market average.
          Assumes 24/7 availability. Provider receives 85% of gross. Actual results will vary.
        </p>
      </div>
    </motion.div>
  );
};

function ComparisonLines({ revenue, power, dc1Fee, net, annual }: {
  revenue: number; power: number; dc1Fee: number | null; net: number; annual: number;
}) {
  const fmt = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1000) return `$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (abs >= 10) return `$${abs.toFixed(0)}`;
    return `$${abs.toFixed(2)}`;
  };

  const netColor = net >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";

  return (
    <div className="space-y-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>
      <LineItem label="Revenue" value={`${fmt(revenue)}/mo`} className="text-foreground" />
      <LineItem label="Power" value={`-${fmt(power)}/mo`} className="text-destructive/70" />
      {dc1Fee !== null ? (
        <LineItem label="DC1 fee (15%)" value={`-${fmt(dc1Fee)}/mo`} className="text-destructive/70" />
      ) : (
        <LineItem label="DC1 fee" value="—" className="text-muted-foreground/40" />
      )}
      <div className="border-t border-border/30 my-2" />
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold" style={{ color: netColor }}>Net</span>
        <span className="text-lg font-bold" style={{ color: netColor }}>
          {net < 0 ? "-" : ""}{fmt(net)}/mo
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-xs" style={{ color: netColor }}>Annual</span>
        <span className="text-sm font-semibold" style={{ color: netColor }}>
          {annual < 0 ? "-" : ""}{fmt(annual)}/yr
        </span>
      </div>
    </div>
  );
}

function LineItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm ${className || ""}`}>{value}</span>
    </div>
  );
}

function ValueItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export default EarningsReport;
