import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import {
  GPU_DB, ENERGY_BY_COUNTRY, DEFAULT_ENERGY_RATE,
  type GPUInfo,
} from "@/lib/gpu-data";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

interface EarningsReportProps {
  gpuName: string;
  gpuCount?: number;
}

const MONTHLY_HOURS = 730;
const DC1_ENERGY = 0.048;
const DC1_FEE_PCT = 0.15;

const COUNTRY_FLAGS: Record<string, string> = {
  SA: '\u{1F1F8}\u{1F1E6}', AE: '\u{1F1E6}\u{1F1EA}', US: '\u{1F1FA}\u{1F1F8}',
  GB: '\u{1F1EC}\u{1F1E7}', DE: '\u{1F1E9}\u{1F1EA}', FR: '\u{1F1EB}\u{1F1F7}',
  NL: '\u{1F1F3}\u{1F1F1}', CA: '\u{1F1E8}\u{1F1E6}', AU: '\u{1F1E6}\u{1F1FA}',
  JP: '\u{1F1EF}\u{1F1F5}', KR: '\u{1F1F0}\u{1F1F7}', IN: '\u{1F1EE}\u{1F1F3}',
  BR: '\u{1F1E7}\u{1F1F7}', TR: '\u{1F1F9}\u{1F1F7}', EG: '\u{1F1EA}\u{1F1EC}',
  BH: '\u{1F1E7}\u{1F1ED}', QA: '\u{1F1F6}\u{1F1E6}', KW: '\u{1F1F0}\u{1F1FC}',
  OM: '\u{1F1F4}\u{1F1F2}',
};

const EarningsReport = ({ gpuName, gpuCount = 1 }: EarningsReportProps) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLabel, setCountryLabel] = useState("Detecting...");
  const [userEnergyRate, setUserEnergyRate] = useState<number>(DEFAULT_ENERGY_RATE);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const gpu = GPU_DB[gpuName];

  // IP geolocation
  useEffect(() => {
    if (!gpu) return;
    (async () => {
      try {
        const resp = await fetch("https://ip-api.com/json/?fields=countryCode,country");
        const data = await resp.json();
        const code = data.countryCode as string;
        setCountryCode(code);
        const entry = ENERGY_BY_COUNTRY[code];
        if (entry) {
          setUserEnergyRate(entry.rate);
          setCountryLabel(entry.label);
        } else {
          setUserEnergyRate(DEFAULT_ENERGY_RATE);
          setCountryLabel(data.country || "Other");
        }
      } catch {
        setCountryCode(null);
        setCountryLabel("Unknown");
        setUserEnergyRate(DEFAULT_ENERGY_RATE);
      }
    })();
  }, [gpu]);

  if (!gpu) return null;

  const rate = gpu.rate;
  const util = gpu.utilization;
  const tdpKw = gpu.tdp / 1000;

  // User location calc
  const grossMonthly = rate * util * MONTHLY_HOURS;
  const energyUser = tdpKw * MONTHLY_HOURS * userEnergyRate;
  const netUser = grossMonthly - energyUser;
  const annualUser = netUser * 12;

  // DC1 calc
  const energyDC1 = tdpKw * MONTHLY_HOURS * DC1_ENERGY;
  const dc1Fee = grossMonthly * DC1_FEE_PCT;
  const netDC1 = grossMonthly - energyDC1 - dc1Fee;
  const annualDC1 = netDC1 * 12;

  const dc1Better = netDC1 > netUser;
  const advantage = annualDC1 - annualUser;
  const advantagePct = annualUser > 0 ? ((advantage / annualUser) * 100) : 0;

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    return `$${n.toFixed(2)}`;
  };

  const handleEditSave = () => {
    const v = parseFloat(editValue);
    if (!isNaN(v) && v > 0 && v < 2) {
      setUserEnergyRate(v);
      setCountryLabel(countryLabel.replace(/ \(custom\)$/, "") + " (custom)");
    }
    setEditing(false);
  };

  const flag = countryCode ? COUNTRY_FLAGS[countryCode] || "" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card overflow-hidden mb-5"
    >
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <p className="text-xs uppercase tracking-[2px] text-muted-foreground font-medium">
          Your Earnings Estimate
        </p>
      </div>

      {/* Hardware Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border divide-x divide-border">
        <SummaryCell label="GPU" value={gpuName} />
        <SummaryCell label="VRAM" value={`${gpu.vram}GB`} />
        <SummaryCell label="Market Rate" value={`$${rate.toFixed(2)}/hr`} />
        <SummaryCell label="Global Demand" value={`${Math.round(util * 100)}% utilization`} />
      </div>

      {/* Location & Energy */}
      <div className="border-b border-border px-6 py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground">
            {flag && <span className="mr-1.5">{flag}</span>}
            Your estimated energy cost: <span className="font-semibold">${userEnergyRate.toFixed(3)}/kWh</span>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setEditValue(userEnergyRate.toString()); }}
                className="ml-2 inline-flex items-center text-xs text-secondary hover:underline"
              >
                <Pencil className="h-3 w-3 mr-0.5" /> edit
              </button>
            )}
          </div>
        </div>
        {editing && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              min="0.01"
              max="1"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-28 rounded border border-border bg-muted px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <span className="text-xs text-muted-foreground">$/kWh</span>
            <button onClick={handleEditSave} className="text-xs font-medium text-secondary hover:underline">Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-muted-foreground hover:underline">Cancel</button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Saudi energy rate: $0.048/kWh (SEC licensed operator tariff)
        </p>
      </div>

      {/* Comparison Table */}
      <div className="px-6 py-5">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium text-xs w-[45%]" />
              <TableHead className="text-muted-foreground font-medium text-xs text-right">
                {flag} Your Location
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-xs text-right">
                DC1 (Saudi Energy)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataRow label="Hourly rate per GPU" user={`$${rate.toFixed(2)}`} dc1={`$${rate.toFixed(2)}`} />
            <DataRow label="Utilization (market avg)" user={`${Math.round(util * 100)}%`} dc1={`${Math.round(util * 100)}%`} />
            <DataRow label="Monthly gross revenue" user={fmt(grossMonthly)} dc1={fmt(grossMonthly)} />
            <DataRow label="Energy cost per GPU/month" user={`-${fmt(energyUser)}`} dc1={`-${fmt(energyDC1)}`} />
            <DataRow label="DC1 platform fee" user={"\u2014"} dc1={`-${fmt(dc1Fee)}`} />
            <DataRow
              label="Monthly net per GPU"
              user={fmt(netUser)}
              dc1={fmt(netDC1)}
              bold
              highlightDC1={dc1Better}
            />
            <DataRow
              label="Annual net per GPU"
              user={fmt(annualUser)}
              dc1={fmt(annualDC1)}
              bold
              highlightDC1={dc1Better}
            />
            {gpuCount > 1 && (
              <DataRow
                label={`Annual net (${gpuCount} GPUs)`}
                user={fmt(annualUser * gpuCount)}
                dc1={fmt(annualDC1 * gpuCount)}
                bold
                highlightDC1={dc1Better}
              />
            )}
          </TableBody>
        </Table>

        {/* Advantage badge */}
        {dc1Better ? (
          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-center">
            <span className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>
              DC1 Advantage: +{fmt(Math.abs(advantage))}/yr per GPU (+{Math.round(Math.abs(advantagePct))}%)
            </span>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center">
            <span className="text-sm text-muted-foreground">
              You're already on competitive energy. DC1 still adds: managed billing, security, and demand matching.
            </span>
          </div>
        )}
      </div>

      {/* Data Sources Footer */}
      <div className="border-t border-border px-6 py-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Market rates: vast.ai global index (updated Feb 2026). Energy rates: IEA and SEC published tariffs.
          GPU power draw: manufacturer TDP specifications. Utilization: global market average.
          Assumes 24/7 availability. Actual results will vary.
        </p>
      </div>
    </motion.div>
  );
};

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{value}</p>
    </div>
  );
}

function DataRow({ label, user, dc1, bold, highlightDC1 }: {
  label: string; user: string; dc1: string; bold?: boolean; highlightDC1?: boolean;
}) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        {label}
      </TableCell>
      <TableCell className={`text-sm text-right ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        {user}
      </TableCell>
      <TableCell className={`text-sm text-right ${bold ? "font-semibold" : ""} ${highlightDC1 ? "font-semibold" : "text-muted-foreground"}`}
        style={highlightDC1 ? { color: "hsl(var(--success))" } : undefined}
      >
        {dc1}
      </TableCell>
    </TableRow>
  );
}

export default EarningsReport;
