import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dc1Logo from "@/assets/dc1-logo.jpg";

const navItems = ["Solutions", "Infrastructure", "Network", "Pricing", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="/" className="font-mono text-lg font-bold tracking-tight text-foreground">
          <span className="text-primary">NEXUS</span>DC
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button className="rounded-md border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:shadow-[var(--glow-primary)]">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="mt-2 rounded-md border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
