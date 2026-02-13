import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { GPU_SELECT_OPTIONS, GPU_DB } from "@/lib/gpu-data";
import { persistGPU } from "@/lib/gpu-persist";
import { useLanguage } from "@/contexts/LanguageContext";
export { getPersistedGPU, persistGPU } from "@/lib/gpu-persist";

interface GPUManualSelectorProps {
  currentGPU: string;
  onSelect: (name: string) => void;
  autoFocus?: boolean;
}

export default function GPUManualSelector({ currentGPU, onSelect, autoFocus }: GPUManualSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    if (!search.trim()) return GPU_SELECT_OPTIONS;
    const q = search.toLowerCase();
    return GPU_SELECT_OPTIONS.filter(g => g.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (autoFocus) setOpen(true);
  }, [autoFocus]);

  const handleSelect = (name: string) => {
    onSelect(name);
    persistGPU(name);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground hover:border-primary/40 transition-colors"
      >
        <span>{currentGPU && GPU_DB[currentGPU] ? `NVIDIA ${currentGPU}` : t("placeholder.select_gpu")}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("placeholder.search_gpus")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">{t("gpu.no_match")}</p>
            ) : (
              filtered.map(g => {
                const info = GPU_DB[g];
                return (
                  <button
                    key={g}
                    onClick={() => handleSelect(g)}
                    className={`w-full text-start px-4 py-3 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between ${
                      currentGPU === g ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <span>NVIDIA {g}</span>
                    {info && (
                      <span className="text-xs text-muted-foreground">{info.vram}GB · ${info.rate}/hr</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
