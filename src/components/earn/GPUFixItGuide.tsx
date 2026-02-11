import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Chrome, Globe, Compass, Monitor, Bookmark } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Browser = "chrome" | "firefox" | "safari" | "other";

function detectBrowser(): Browser {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";
  if (ua.includes("chrome") || ua.includes("edg")) return "chrome";
  return "other";
}

interface GPUFixItGuideProps {
  open: boolean;
  onClose: () => void;
}

export default function GPUFixItGuide({ open, onClose }: GPUFixItGuideProps) {
  const isMobile = useIsMobile();
  const browser = detectBrowser();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const pageUrl = window.location.href;

  const browserInstructions: { key: Browser; label: string; icon: React.ReactNode; url: string; steps: string[] }[] = [
    {
      key: "chrome",
      label: "Chrome / Edge",
      icon: <Chrome className="h-4 w-4" />,
      url: "chrome://settings/system",
      steps: [
        "Paste the link below in your address bar",
        "Toggle ON \"Use graphics acceleration when available\"",
        "Click \"Relaunch\" to restart your browser",
      ],
    },
    {
      key: "firefox",
      label: "Firefox",
      icon: <Globe className="h-4 w-4" />,
      url: "about:preferences",
      steps: [
        "Paste the link below in your address bar",
        "Search for \"hardware\"",
        "Check \"Use hardware acceleration when available\"",
        "Restart Firefox",
      ],
    },
    {
      key: "safari",
      label: "Safari",
      icon: <Compass className="h-4 w-4" />,
      url: "",
      steps: [
        "Hardware acceleration is on by default in Safari",
        "If your GPU still isn't detected, try Chrome or Edge instead",
      ],
    },
  ];

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Fix GPU Detection</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
            <h3 className="text-sm font-semibold text-foreground">Enable Hardware Acceleration</h3>
          </div>

          <div className="space-y-3">
            {browserInstructions.map((b) => {
              const isActive = browser === b.key || (browser === "other" && b.key === "chrome");
              return (
                <div
                  key={b.key}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/30 bg-muted/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {b.icon}
                    <span className="text-sm font-medium text-foreground">{b.label}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                        Your browser
                      </span>
                    )}
                  </div>
                  <ol className="space-y-1.5 ml-6">
                    {b.steps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground list-decimal">{step}</li>
                    ))}
                  </ol>
                  {b.url && (
                    <button
                      onClick={() => copyText(b.url, b.key)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                    >
                      {copiedUrl === b.key ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      {copiedUrl === b.key ? "Copied!" : `Copy ${b.url}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
            <h3 className="text-sm font-semibold text-foreground">Restart & Return</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Restart your browser, then come back to this page. We'll detect your GPU automatically.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyText(pageUrl, "page")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              {copiedUrl === "page" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              {copiedUrl === "page" ? "Copied!" : "Copy this page link"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Bookmark className="h-3 w-3 text-primary" />
            Tip: Bookmark this page before restarting
          </p>
        </div>
      </div>
    </div>
  );

  // Mobile: bottom sheet, Desktop: slide-out panel
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {isMobile ? (
            /* Mobile bottom sheet */
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl border-t border-border bg-card overflow-hidden"
            >
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30 mx-auto mt-2 mb-1" />
              {content}
            </motion.div>
          ) : (
            /* Desktop slide-out */
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border overflow-hidden"
            >
              {content}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
