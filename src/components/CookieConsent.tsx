import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export type CookieChoice = "accepted" | "declined" | null;

export const getCookieConsent = (): CookieChoice => {
  return localStorage.getItem("dc1-cookie-consent") as CookieChoice;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!getCookieConsent()) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    localStorage.setItem("dc1-cookie-consent", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-5 shadow-2xl">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("cookie.text")}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" onClick={() => handleChoice("accepted")}>
            {t("cookie.accept")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleChoice("declined")}>
            {t("cookie.decline")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
