import dc1Logo from "@/assets/dc1-logo.jpg";
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
          </div>

          {/* Right */}
          <div className="flex items-start gap-4 sm:justify-end">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 HAAK Energy Solutions Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
