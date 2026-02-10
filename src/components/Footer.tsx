const footerLinks = {
  Solutions: ["Colocation", "Bare Metal", "Cloud", "GPU Clusters", "CDN"],
  Company: ["About", "Careers", "Blog", "Press"],
  Support: ["Documentation", "Status", "Contact", "SLA"],
  Legal: ["Privacy", "Terms", "Compliance"],
};

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a href="/" className="font-mono text-lg font-bold text-foreground">
              <span className="text-primary">NEXUS</span>DC
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Enterprise datacenter infrastructure for the modern web.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-secondary-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 NexusDC. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-terminal-ok animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
