import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-1.5 rounded-md border border-border/50 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-border focus:outline-none"
      aria-label="Switch language"
    >
      <span className={lang === "en" ? "font-bold text-foreground" : ""}>EN</span>
      <span className="text-border">|</span>
      <span className={`font-noto-kufi ${lang === "ar" ? "font-bold text-foreground" : ""}`}>عربي</span>
    </button>
  );
};

export default LanguageSwitcher;
