import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  GPU_DB, detectGPU, matchGPU, getMarketPrice,
  calcEarnings, calcComparison,
  type GPUInfo, type LiveGPUData,
} from "@/lib/gpu-data";

interface GPUContextValue {
  detecting: boolean;
  detectedGPU: string | null;
  rawRenderer: string | null;
  gpuInfo: GPUInfo | undefined;
  isKnown: boolean;
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
  const [liveData, setLiveData] = useState<LiveGPUData | null>(null);
  const [marketPrice, setMarketPrice] = useState(0);
  const [utilization, setUtilization] = useState(60);

  useEffect(() => {
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
        const matched = matchGPU(detection.renderer);
        if (matched) {
          setDetectedGPU(matched);
          setRawRenderer(detection.renderer);
          if (GPU_DB[matched]) {
            setMarketPrice(getMarketPrice(matched, live));
          }
        } else {
          setRawRenderer(detection.renderer || null);
        }
      }
      setDetecting(false);
    })();
  }, []);

  const selectGPU = useCallback((name: string) => {
    setDetectedGPU(name);
    setRawRenderer(null);
    if (GPU_DB[name]) {
      setMarketPrice(getMarketPrice(name, liveData));
    }
  }, [liveData]);

  const gpuInfo = detectedGPU ? GPU_DB[detectedGPU] : undefined;
  const isKnown = !!gpuInfo;
  const earnings = isKnown ? calcEarnings(detectedGPU!, marketPrice, utilization / 100) : null;
  const comparison = isKnown ? calcComparison(detectedGPU!, marketPrice, utilization / 100) : null;
  const gpuDisplayName = isKnown ? `NVIDIA ${detectedGPU}` : (rawRenderer || detectedGPU || "");

  return (
    <GPUContext.Provider value={{
      detecting, detectedGPU, rawRenderer, gpuInfo, isKnown,
      marketPrice, utilization, setUtilization, selectGPU,
      earnings, comparison, gpuDisplayName,
    }}>
      {children}
    </GPUContext.Provider>
  );
}
