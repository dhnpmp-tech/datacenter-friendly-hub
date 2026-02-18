import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, RotateCcw, Zap, Shield, CheckCircle, Lock, Server } from "lucide-react";
import {
  GPU_DB, ENERGY_BY_COUNTRY, DEFAULT_ENERGY_RATE,
  type GPUInfo,
} from "@/lib/gpu-data";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { dual } = useCurrency();
  const { t } = useLanguage();
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
  const dc1Rate = gpu.dc1Rate;
  const discountPct = Math.round(((rate - dc1Rate) / rate) * 100);
  const util = gpu.utilization;
  const tdpKw = gpu.tdp / 1000;
  const systemKw = tdpKw * OVERHEAD;

  const grossMonthly = rate * util * MONTHLY_HOURS;
  const revenueForProvider = grossMonthly * 0.85;
  const revenueHourly = rate * util * 0.85;

  const powerHourlyUser = systemKw * userEnergyRate;
  const powerMonthlyUser = systemKw * MONTHLY_HOURS * userEnergyRate;
  const powerHourlyDC1 = systemKw * DC1_ENERGY;
  const powerMonthlyDC1 = systemKw * MONTHLY_HOURS * DC1_ENERGY;

  const dc1Fee = grossMonthly * DC1_FEE_PCT;

  const netUser = revenueForProvider - powerMonthlyUser;
  const netDC1 = revenueForProvider - powerMonthlyDC1 - dc1Fee;
  const annualUser = netUser * 12;
  const annualDC1 = netDC1 * 12;

  const pctDiff = netUser !== 0 ? ((netDC1 - netUser) / Math.abs(netUser)) * 100 : 0;
  const bothNegative = netUser < 0 && netDC1 < 0;
  const userNegDC1Pos = netUser < 0 && netDC1 > 0;
  const dc1Better10 = netDC1 > netUser * 1.1 && !bothNegative && !userNegDC1Pos;
  const withinRange = !bothNegative && !userNegDC1Pos && !dc1Better10 && netDC1 >= netUser;
  const dc1Worse = !bothNegative && !userNegDC1Pos && netDC1 < netUser;
  const showPlatformValue = withinRange || dc1Worse;

  const flag = countryCode ? COUNTRY_FLAGS[countryCode] || "" : "";

  const fmtDual = (usd: number, period: string) => dual(usd, period);
  const fmtDualAbs = (usd: number, period: string) => dual(Math.abs(usd), period);

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

  const animRevHourly = useAnimatedNumber(revenueHourly * gpuCount);
  const animRevMonthly = useAnimatedNumber(revenueForProvider * gpuCount);
  const animPwrHourly = useAnimatedNumber(powerHourlyUser * gpuCount);
  const animPwrMonthly = useAnimatedNumber(powerMonthlyUser * gpuCount);

  const revHrDual = fmtDual(animRevHourly, "/hr");
  const revMoDual = fmtDual(animRevMonthly, "/mo");
  const pwrHrDual = fmtDual(animPwrHourly, "/hr");
  const pwrMoDual = fmtDual(animPwrMonthly, "/mo");

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
          {t("report.gpu_economics")}
        </p>
      </div>

      {/* Rate Comparison Strip */}
      <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
          <div className="flex-1 flex items-center gap-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Market Rate</p>
              <p className="text-base font-bold text-foreground">${rate.toFixed(2)}<span className="text-xs text-muted-foreground font-normal">/hr</span></p>
            </div>
            <div className="flex-1 h-px bg-border/50 hidden sm:block" />
            <div className="text-center px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5">
              <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-1">DC1 Rate</p>
              <p className="text-base font-bold text-primary">${dc1Rate.toFixed(2)}<span className="text-xs text-primary/70 font-normal">/hr</span></p>
            </div>
            <div className="flex-1 h-px bg-border/50 hidden sm:block" />
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Your Savings</p>
              <p className="text-base font-bold" style={{ color: "hsl(var(--success))" }}>{discountPct}% below market</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2.5">
          Based on vast.ai global index · Rates updated daily based on market conditions
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-border/50">
        <div className="p-6 border-b sm:border-b-0 sm:border-e border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{t("report.revenue")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {revHrDual.primary}
            </span>
            <span className="text-sm text-muted-foreground">{revHrDual.secondary}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {revMoDual.primary}
            </span>
            <span className="text-xs text-muted-foreground">{revMoDual.secondary}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("report.market_rate_at")} {Math.round(util * 100)}% {t("report.utilization")}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            {gpu.tdp}W x 730hrs x {Math.round(util * 100)}% x ${rate.toFixed(2)}
          </p>
          {gpuCount > 1 && (
            <p className="text-[11px] text-muted-foreground mt-1">x {gpuCount} GPUs</p>
          )}
        </div>

        <div className="p-6">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{t("report.power_cost")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: "hsl(0 84% 60% / 0.7)", fontVariantNumeric: "tabular-nums" }}>
              {pwrHrDual.primary}
            </span>
            <span className="text-sm text-muted-foreground">{pwrHrDual.secondary}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-semibold" style={{ color: "hsl(0 84% 60% / 0.7)", fontVariantNumeric: "tabular-nums" }}>
              {pwrMoDual.primary}
            </span>
            <span className="text-xs text-muted-foreground">{pwrMoDual.secondary}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("report.based_on")} {flag} {countryLabel}: ${userEnergyRate.toFixed(3)}/kWh
            {isCustomRate && <span className="text-muted-foreground/50"> {t("report.custom")}</span>}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            {!editing && (
              <button
                onClick={() => { setEditing(true); setEditValue(userEnergyRate.toString()); }}
                className="text-[11px] text-secondary hover:underline inline-flex items-center gap-0.5"
              >
                <Pencil className="h-2.5 w-2.5" /> {t("report.edit_rate")}
              </button>
            )}
            {isCustomRate && !editing && (
              <button
                onClick={handleReset}
                className="text-[11px] text-muted-foreground hover:underline inline-flex items-center gap-0.5"
              >
                <RotateCcw className="h-2.5 w-2.5" /> {t("report.reset")}
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
              <button onClick={handleEditSave} className="text-[11px] font-medium text-secondary hover:underline">{t("report.save")}</button>
              <button onClick={() => setEditing(false)} className="text-[11px] text-muted-foreground hover:underline">{t("report.cancel")}</button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 — Net Profit Comparison */}
      <div className="border-b border-border/50 px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <div className="pe-0 sm:pe-5 sm:border-e border-border/30 pb-4 sm:pb-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              {t("report.running_from")} {flag} {countryLabel}
            </p>
            <ComparisonLines
              revenue={revenueForProvider * gpuCount}
              power={powerMonthlyUser * gpuCount}
              dc1Fee={null}
              net={netUser * gpuCount}
              annual={annualUser * gpuCount}
              dual={dual}
              t={t}
            />
          </div>

          <div className="ps-0 sm:ps-5 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/30">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              {t("report.running_on_dc1")} {COUNTRY_FLAGS.SA} {t("report.saudi_arabia")}
            </p>
            <ComparisonLines
              revenue={revenueForProvider * gpuCount}
              power={powerMonthlyDC1 * gpuCount}
              dc1Fee={dc1Fee * gpuCount}
              net={netDC1 * gpuCount}
              annual={annualDC1 * gpuCount}
              dual={dual}
              t={t}
            />
          </div>
        </div>

        {/* Conditional messages */}
        <div className="mt-5">
          {bothNegative && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <p className="text-sm text-yellow-400/90">
                {t("report.negative_returns")}
              </p>
            </div>
          )}
          {userNegDC1Pos && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
              <p className="text-sm" style={{ color: "hsl(var(--success))" }}>
                {t("report.user_neg_dc1_pos")}
              </p>
            </div>
          )}
          {dc1Better10 && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
              <p className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>
                DC1 Advantage: +{fmtDualAbs(Math.abs(netDC1 - netUser) * gpuCount, "/mo").primary} (+{Math.round(Math.abs(pctDiff))}%)
              </p>
            </div>
          )}
          {withinRange && (
            <div className="rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {t("report.similar_returns")}
              </p>
            </div>
          )}
          {dc1Worse && (
            <div className="rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                DC1 costs {fmtDualAbs(Math.abs(netUser - netDC1) * gpuCount, "/mo").primary} — {t("report.fee_replaces")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — Platform Value (conditional) */}
      {showPlatformValue && (
        <div className="border-b border-border/50 px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            {t("report.platform_fee_includes")}
          </p>
          <div className="space-y-2.5">
            <ValueItem icon={Zap} text={t("report.managed_billing")} />
            <ValueItem icon={Shield} text={t("report.security_model")} />
            <ValueItem icon={CheckCircle} text={t("report.sdaia_compliance")} />
            <ValueItem icon={Lock} text={t("report.guaranteed_rate")} />
            <ValueItem icon={Server} text={t("report.zero_infra")} />
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-4">
            {t("report.fee_replaces")}
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

function ComparisonLines({ revenue, power, dc1Fee, net, annual, dual, t }: {
  revenue: number; power: number; dc1Fee: number | null; net: number; annual: number;
  dual: (usd: number, period?: string) => { primary: string; secondary: string };
  t: (key: string) => string;
}) {
  const netColor = net >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";

  const revDual = dual(revenue, "/mo");
  const pwrDual = dual(power, "/mo");
  const feeDual = dc1Fee !== null ? dual(dc1Fee, "/mo") : null;
  const netDual = dual(Math.abs(net), "/mo");
  const annDual = dual(Math.abs(annual), "/yr");

  return (
    <div className="space-y-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>
      <LineItem label={t("report.revenue")} value={revDual.primary} secondary={revDual.secondary} className="text-foreground" />
      <LineItem label={t("report.power")} value={`-${pwrDual.primary}`} secondary={pwrDual.secondary} className="text-destructive/70" />
      {feeDual ? (
        <LineItem label={t("report.dc1_fee_15")} value={`-${feeDual.primary}`} secondary={feeDual.secondary} className="text-destructive/70" />
      ) : (
        <LineItem label={t("report.dc1_fee")} value="—" className="text-muted-foreground/40" />
      )}
      <div className="border-t border-border/30 my-2" />
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold" style={{ color: netColor }}>{t("report.net")}</span>
        <div className="text-end">
          <span className="text-lg font-bold" style={{ color: netColor }}>
            {net < 0 ? "-" : ""}{netDual.primary}
          </span>
          <span className="text-xs text-muted-foreground ms-1.5">{netDual.secondary}</span>
        </div>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-xs" style={{ color: netColor }}>{t("report.annual")}</span>
        <div className="text-end">
          <span className="text-sm font-semibold" style={{ color: netColor }}>
            {annual < 0 ? "-" : ""}{annDual.primary}
          </span>
          <span className="text-xs text-muted-foreground ms-1.5">{annDual.secondary}</span>
        </div>
      </div>
    </div>
  );
}

function LineItem({ label, value, secondary, className }: { label: string; value: string; secondary?: string; className?: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-end">
        <span className={`text-sm ${className || ""}`}>{value}</span>
        {secondary && <span className="text-xs text-muted-foreground ms-1.5">{secondary}</span>}
      </div>
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
