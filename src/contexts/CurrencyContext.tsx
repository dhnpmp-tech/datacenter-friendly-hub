import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type CurrencyInfo,
  detectCountry,
  getCurrencyForCountry,
  getPersistedCurrency,
  persistCurrency,
  formatDual,
  CURRENCY_OPTIONS,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyInfo;
  countryCode: string;
  setCurrency: (countryCode: string) => void;
  /** Format USD to dual currency: { primary, secondary } */
  dual: (usd: number, period?: string) => { primary: string; secondary: string };
  options: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState<string>(() => {
    return getPersistedCurrency() || detectCountry();
  });

  const currency = getCurrencyForCountry(countryCode);

  const setCurrency = useCallback((cc: string) => {
    setCountryCode(cc);
    persistCurrency(cc);
  }, []);

  const dual = useCallback(
    (usd: number, period?: string) => formatDual(usd, currency, period),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, countryCode, setCurrency, dual, options: CURRENCY_OPTIONS }}>
      {children}
    </CurrencyContext.Provider>
  );
}
