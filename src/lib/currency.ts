const STORAGE_KEY = "dc1_currency";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // rate from USD
  flag: string;
  label: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  SA: { code: "SAR", symbol: "﷼", rate: 3.75, flag: "🇸🇦", label: "Saudi Riyal" },
  US: { code: "USD", symbol: "$", rate: 1, flag: "🇺🇸", label: "US Dollar" },
  AE: { code: "AED", symbol: "AED ", rate: 3.67, flag: "🇦🇪", label: "UAE Dirham" },
  GB: { code: "GBP", symbol: "£", rate: 0.79, flag: "🇬🇧", label: "British Pound" },
  DE: { code: "EUR", symbol: "€", rate: 0.92, flag: "🇪🇺", label: "Euro" },
  FR: { code: "EUR", symbol: "€", rate: 0.92, flag: "🇪🇺", label: "Euro" },
  NL: { code: "EUR", symbol: "€", rate: 0.92, flag: "🇪🇺", label: "Euro" },
  JP: { code: "JPY", symbol: "¥", rate: 149.5, flag: "🇯🇵", label: "Japanese Yen" },
  IN: { code: "INR", symbol: "₹", rate: 83.1, flag: "🇮🇳", label: "Indian Rupee" },
  EG: { code: "EGP", symbol: "EGP ", rate: 30.9, flag: "🇪🇬", label: "Egyptian Pound" },
  CA: { code: "CAD", symbol: "CA$", rate: 1.35, flag: "🇨🇦", label: "Canadian Dollar" },
  AU: { code: "AUD", symbol: "A$", rate: 1.53, flag: "🇦🇺", label: "Australian Dollar" },
  KR: { code: "KRW", symbol: "₩", rate: 1320, flag: "🇰🇷", label: "South Korean Won" },
};

// Deduplicated list for the dropdown (EUR appears once)
export const CURRENCY_OPTIONS: CurrencyInfo[] = [
  CURRENCIES.SA,
  CURRENCIES.US,
  CURRENCIES.AE,
  CURRENCIES.GB,
  CURRENCIES.DE, // EUR
  CURRENCIES.JP,
  CURRENCIES.IN,
  CURRENCIES.EG,
  CURRENCIES.CA,
  CURRENCIES.AU,
  CURRENCIES.KR,
];

const TZ_TO_COUNTRY: Record<string, string> = {
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Amsterdam": "NL",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
  "Asia/Tokyo": "JP",
  "Asia/Kolkata": "IN",
  "Australia/Sydney": "AU",
  "America/Toronto": "CA",
  "Asia/Seoul": "KR",
  "Africa/Cairo": "EG",
};

export function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
    const locale = navigator.language;
    if (locale.includes("-")) {
      const cc = locale.split("-")[1];
      if (CURRENCIES[cc]) return cc;
    }
  } catch {}
  return "US";
}

export function getCurrencyForCountry(countryCode: string): CurrencyInfo {
  return CURRENCIES[countryCode] || CURRENCIES.US;
}

export function getPersistedCurrency(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function persistCurrency(countryCode: string) {
  try { localStorage.setItem(STORAGE_KEY, countryCode); } catch {}
}

/**
 * Convert USD to local currency value
 */
export function usdToLocal(usd: number, currency: CurrencyInfo): number {
  return usd * currency.rate;
}

/**
 * Format a number with appropriate decimal places based on magnitude
 */
function smartFormat(n: number, rate: number): string {
  const abs = Math.abs(n);
  // For currencies with large rates (JPY, KRW), no decimals
  if (rate >= 100) return Math.round(abs).toLocaleString("en-US");
  if (abs >= 1000) return abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (abs >= 10) return abs.toFixed(0);
  if (abs >= 1) return abs.toFixed(2);
  return abs.toFixed(3);
}

/**
 * Returns primary + secondary formatted strings for a USD amount
 */
export function formatDual(
  usd: number,
  currency: CurrencyInfo,
  period?: string
): { primary: string; secondary: string } {
  const suffix = period || "";
  const isUSD = currency.code === "USD";
  const localVal = usdToLocal(usd, currency);
  const sarVal = usd * 3.75;

  if (isUSD) {
    // USD primary, SAR secondary
    return {
      primary: `$${smartFormat(usd, 1)}${suffix}`,
      secondary: `(﷼${smartFormat(sarVal, 3.75)}${suffix})`,
    };
  }

  // Local primary, USD secondary
  return {
    primary: `${currency.symbol}${smartFormat(localVal, currency.rate)}${suffix}`,
    secondary: `($${smartFormat(usd, 1)}${suffix})`,
  };
}
