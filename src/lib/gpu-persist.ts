import { GPU_DB } from "@/lib/gpu-data";

const STORAGE_KEY = "dc1_selected_gpu";

export function getPersistedGPU(): string | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && GPU_DB[v] ? v : null;
  } catch {
    return null;
  }
}

export function persistGPU(name: string) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch { /* noop */ }
}
