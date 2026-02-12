import { Link } from "react-router-dom";
import dc1Logo from "@/assets/dc1-logo.webp";
import { Twitter, Linkedin } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Advantages", href: "#advantages" },
  { label: "Early Access", href: "#early-access" },
  { label: "Contact", href: "mailto:hello@dc1.tech" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Left */}
          <div>
            <img src={dc1Logo} alt="DC1" className="h-10 w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">Power, Digitalized</p>
          </div>

          {/* Center */}
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
              Privacy Policy
            </Link>
          </div>

          {/* Right */}
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
            DC Power Solutions Company | CR 7053667775
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 DC1 — Saudi Arabia's Compute Marketplace
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
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
