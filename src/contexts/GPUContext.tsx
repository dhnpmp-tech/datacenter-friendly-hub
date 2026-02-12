import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  GPU_DB, detectGPU, matchGPU, getMarketPrice,
  calcEarnings, calcComparison, parseGPUName, getNonDiscreteMessage, autoMatchDropdown,
  type GPUInfo, type LiveGPUData,
} from "@/lib/gpu-data";
import { getPersistedGPU, persistGPU } from "@/lib/gpu-persist";

interface GPUContextValue {
  detecting: boolean;
  detectedGPU: string | null;
  rawRenderer: string | null;
  cleanGPUName: string | null;
  gpuInfo: GPUInfo | undefined;
  isKnown: boolean;
  isNonDiscrete: boolean;
  marketPrice: number;
  utilization: number;
  setUtilization: (v: number) => void;
  selectGPU: (name: string) => void;
  earnings: ReturnType<typeof calcEarnings>;
  comparison: ReturnType<typeof calcComparison>;
  gpuDisplayName: string;
}

const GPUContext = createContext<GPUContextValue | null>(null);

export function useGPUDetection() {
  const ctx = useContext(GPUContext);
  if (!ctx) throw new Error("useGPUDetection must be inside GPUProvider");
  return ctx;
}

export function GPUProvider({ children }: { children: ReactNode }) {
  const [detecting, setDetecting] = useState(true);
  const [detectedGPU, setDetectedGPU] = useState<string | null>(null);
  const [rawRenderer, setRawRenderer] = useState<string | null>(null);
  const [cleanGPUName, setCleanGPUName] = useState<string | null>(null);
  const [isNonDiscrete, setIsNonDiscrete] = useState(false);
  const [liveData, setLiveData] = useState<LiveGPUData | null>(null);
  const [marketPrice, setMarketPrice] = useState(0);
  const [utilization, setUtilization] = useState(60);

  useEffect(() => {
    const persisted = getPersistedGPU();
    if (persisted) {
      setDetectedGPU(persisted);
      if (GPU_DB[persisted]) {
        setMarketPrice(GPU_DB[persisted].rate);
      }
    }

    (async () => {
      let live: LiveGPUData | null = null;
      try {
        const resp = await fetch("https://500.farm/vastai-exporter/gpu-stats");
        live = await resp.json();
        setLiveData(live);
      } catch {
        // fallback prices used
      }

      const detection = detectGPU();
      if (detection) {
        setRawRenderer(detection.renderer);

        // Check for non-discrete GPU
        const nonDiscreteMsg = getNonDiscreteMessage(detection.renderer);
        if (nonDiscreteMsg) {
          setIsNonDiscrete(true);
          const parsed = parseGPUName(detection.renderer);
          if (parsed) setCleanGPUName(parsed.clean);
          // If persisted, use that; otherwise leave unmatched
          if (persisted && GPU_DB[persisted]) {
            setMarketPrice(getMarketPrice(persisted, live));
          }
          setDetecting(false);
          return;
        }

        const parsed = parseGPUName(detection.renderer);
        if (parsed) {
          setCleanGPUName(parsed.clean);
          const autoMatch = autoMatchDropdown(parsed.clean);
          if (autoMatch && GPU_DB[autoMatch] && !persisted) {
            setDetectedGPU(autoMatch);
            setMarketPrice(getMarketPrice(autoMatch, live));
            setDetecting(false);
            return;
          }
        }

        const matched = matchGPU(detection.renderer);
        if (matched && !persisted) {
          setDetectedGPU(matched);
          if (GPU_DB[matched]) {
            setMarketPrice(getMarketPrice(matched, live));
          }
        }
      }
      setDetecting(false);
    })();
  }, []);

  const selectGPU = useCallback((name: string) => {
    setDetectedGPU(name);
    setRawRenderer(null);
    setIsNonDiscrete(false);
    persistGPU(name);
    if (GPU_DB[name]) {
      setMarketPrice(getMarketPrice(name, liveData));
    }
  }, [liveData]);

  const gpuInfo = detectedGPU ? GPU_DB[detectedGPU] : undefined;
  const isKnown = !!gpuInfo;
  const earnings = isKnown ? calcEarnings(detectedGPU!, marketPrice, utilization / 100) : null;
  const comparison = isKnown ? calcComparison(detectedGPU!, marketPrice, utilization / 100) : null;
  const gpuDisplayName = cleanGPUName || (isKnown ? `NVIDIA ${detectedGPU}` : (rawRenderer || detectedGPU || ""));

  return (
    <GPUContext.Provider value={{
      detecting, detectedGPU, rawRenderer, cleanGPUName, gpuInfo, isKnown, isNonDiscrete,
      marketPrice, utilization, setUtilization, selectGPU,
      earnings, comparison, gpuDisplayName,
    }}>
      {children}
    </GPUContext.Provider>
  );
}
