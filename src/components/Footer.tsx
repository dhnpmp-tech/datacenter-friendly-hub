import { Link } from "react-router-dom";
import dc1Logo from "@/assets/dc1-logo.webp";
import { Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.how_it_works"), href: "#how-it-works" },
    { label: t("nav.advantages"), href: "#advantages" },
    { label: t("nav.early_access"), href: "#early-access" },
    { label: t("footer.contact"), href: "mailto:hello@dc1st.com" },
  ];

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <img src={dc1Logo} alt="DC1" className="h-10 w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          <div className="flex flex-col items-start gap-2.5 sm:items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("footer.privacy")}
            </Link>
          </div>

          <div className="flex items-start gap-4 sm:justify-end">
            <a
              href="https://x.com/DC1sa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/dc1sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground/70">
            {t("footer.legal")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="https://x.com/DC1sa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
              aria-label="X"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/dc1sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://dc1st.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              dc1st.com
            </a>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("dc1-cookie-consent");
              window.location.reload();
            }}
            className="text-xs text-muted-foreground/50 underline-offset-4 hover:underline hover:text-foreground transition-colors"
          >
            {t("footer.cookie_settings")}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
