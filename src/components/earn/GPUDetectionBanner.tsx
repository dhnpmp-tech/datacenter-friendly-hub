import { useState } from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import GPUFixItGuide from "./GPUFixItGuide";
import { useIsMobile } from "@/hooks/use-mobile";

interface GPUDetectionBannerProps {
  rawRenderer: string;
  onSelectManually: () => void;
}

export default function GPUDetectionBanner({ rawRenderer, onSelectManually }: GPUDetectionBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const isMobile = useIsMobile();

  if (dismissed) return null;

  return (
    <>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-5 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <AlertTriangle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              We detected <span className="font-semibold">{rawRenderer}</span> — that doesn't look like your main GPU.
              {isMobile
                ? " Select your GPU below to see accurate earnings."
                : " Enable hardware acceleration to see your real GPU's earnings."}
            </p>
            <div className="flex flex-wrap gap-2">
              {!isMobile && (
                <button
                  onClick={() => setGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/30 transition-colors"
                >
                  Fix it now <ArrowRight className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={onSelectManually}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border text-muted-foreground px-3 py-1.5 text-xs font-medium hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Select manually
              </button>
            </div>
          </div>
        </div>
      </div>

      <GPUFixItGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
