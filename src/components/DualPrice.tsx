import { useCurrency } from "@/contexts/CurrencyContext";

interface DualPriceProps {
  usd: number;
  period?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  inline?: boolean;
}

/** Renders a price with primary currency (larger) and secondary (smaller, muted) */
const DualPrice = ({
  usd,
  period,
  primaryClassName = "text-foreground",
  secondaryClassName = "text-muted-foreground",
  inline = true,
}: DualPriceProps) => {
  const { dual } = useCurrency();
  const { primary, secondary } = dual(usd, period);

  if (inline) {
    return (
      <span>
        <span className={primaryClassName}>{primary}</span>{" "}
        <span className={`text-[0.85em] ${secondaryClassName}`}>{secondary}</span>
      </span>
    );
  }

  return (
    <div>
      <span className={primaryClassName}>{primary}</span>
      <span className={`block text-[0.85em] ${secondaryClassName}`}>{secondary}</span>
    </div>
  );
};

export default DualPrice;
