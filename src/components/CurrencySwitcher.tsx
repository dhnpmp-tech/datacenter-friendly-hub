import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";

const CurrencySwitcher = () => {
  const { currency, setCurrency, options } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded-md border border-border/50 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-border focus:outline-none">
          {currency.flag} {currency.symbol.trim()}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] bg-popover border-border">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.code}
            onClick={() => {
              // Find the country code for this currency
              const cc = opt.code === "SAR" ? "SA" : opt.code === "USD" ? "US" : opt.code === "AED" ? "AE"
                : opt.code === "GBP" ? "GB" : opt.code === "EUR" ? "DE" : opt.code === "JPY" ? "JP"
                : opt.code === "INR" ? "IN" : opt.code === "EGP" ? "EG" : opt.code === "CAD" ? "CA"
                : opt.code === "AUD" ? "AU" : opt.code === "KRW" ? "KR" : "US";
              setCurrency(cc);
            }}
            className={`text-xs cursor-pointer ${currency.code === opt.code ? "bg-accent" : ""}`}
          >
            <span className="mr-2">{opt.flag}</span>
            {opt.code} ({opt.symbol.trim()})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
