// GPU database with power consumption, market rates, and matching patterns
export interface GPUInfo {
  vram: number;
  tdp: number;
  tier: 'high' | 'mid' | 'low';
  cores: string;
  rate: number; // $/hr market rate
  utilization: number; // 0-1 global market avg
}

export const GPU_DB: Record<string, GPUInfo> = {
  'RTX 5090': { vram: 32, tdp: 450, tier: 'high', cores: '~21,760', rate: 0.55, utilization: 0.73 },
  'RTX 5080': { vram: 16, tdp: 360, tier: 'mid', cores: '~10,752', rate: 0.35, utilization: 0.65 },
  'RTX 4090': { vram: 24, tdp: 450, tier: 'high', cores: '16,384', rate: 0.42, utilization: 0.73 },
  'RTX 4080': { vram: 16, tdp: 320, tier: 'mid', cores: '9,728', rate: 0.28, utilization: 0.60 },
  'RTX 4070 Ti': { vram: 12, tdp: 285, tier: 'mid', cores: '7,680', rate: 0.22, utilization: 0.58 },
  'RTX 4070': { vram: 12, tdp: 200, tier: 'mid', cores: '5,888', rate: 0.19, utilization: 0.55 },
  'RTX 4060 Ti': { vram: 8, tdp: 160, tier: 'low', cores: '4,352', rate: 0.17, utilization: 0.52 },
  'RTX 4060': { vram: 8, tdp: 115, tier: 'low', cores: '3,072', rate: 0.15, utilization: 0.50 },
  'RTX 3090': { vram: 24, tdp: 350, tier: 'mid', cores: '10,496', rate: 0.18, utilization: 0.50 },
  'RTX 3080': { vram: 10, tdp: 320, tier: 'mid', cores: '8,704', rate: 0.14, utilization: 0.45 },
  'RTX 3070': { vram: 8, tdp: 220, tier: 'mid', cores: '5,888', rate: 0.11, utilization: 0.42 },
  'RTX 3060': { vram: 12, tdp: 170, tier: 'low', cores: '3,584', rate: 0.08, utilization: 0.38 },
  'A100 80GB': { vram: 80, tdp: 300, tier: 'high', cores: '6,912', rate: 1.80, utilization: 0.85 },
  'A100 40GB': { vram: 40, tdp: 300, tier: 'high', cores: '6,912', rate: 1.40, utilization: 0.82 },
  'H100': { vram: 80, tdp: 700, tier: 'high', cores: '14,592', rate: 3.50, utilization: 0.90 },
  'L40S': { vram: 48, tdp: 350, tier: 'high', cores: '18,176', rate: 1.20, utilization: 0.75 },
  'A6000': { vram: 48, tdp: 300, tier: 'mid', cores: '10,752', rate: 0.70, utilization: 0.65 },
  'RTX A5000': { vram: 24, tdp: 230, tier: 'mid', cores: '8,192', rate: 0.50, utilization: 0.60 },
};

export const FALLBACK_PRICES: Record<string, number> = Object.fromEntries(
  Object.entries(GPU_DB).map(([k, v]) => [k, v.rate])
);

export const ENERGY = {
  dc1: 0.048,
  us: 0.12,
  dubai: 0.08,
  eu: 0.22,
};

export const ENERGY_BY_COUNTRY: Record<string, { rate: number; label: string }> = {
  SA: { rate: 0.048, label: 'Saudi Arabia' },
  AE: { rate: 0.080, label: 'UAE' },
  US: { rate: 0.120, label: 'United States' },
  GB: { rate: 0.180, label: 'United Kingdom' },
  DE: { rate: 0.220, label: 'Germany' },
  FR: { rate: 0.150, label: 'France' },
  NL: { rate: 0.160, label: 'Netherlands' },
  CA: { rate: 0.100, label: 'Canada' },
  AU: { rate: 0.180, label: 'Australia' },
  JP: { rate: 0.200, label: 'Japan' },
  KR: { rate: 0.110, label: 'South Korea' },
  IN: { rate: 0.080, label: 'India' },
  BR: { rate: 0.140, label: 'Brazil' },
  TR: { rate: 0.090, label: 'Turkey' },
  EG: { rate: 0.050, label: 'Egypt' },
  BH: { rate: 0.030, label: 'Bahrain' },
  QA: { rate: 0.040, label: 'Qatar' },
  KW: { rate: 0.030, label: 'Kuwait' },
  OM: { rate: 0.060, label: 'Oman' },
};

export const DEFAULT_ENERGY_RATE = 0.12;

export const GPU_SELECT_OPTIONS = [
  'RTX 5090', 'RTX 5080', 'RTX 4090', 'RTX 4080', 'RTX 4070 Ti', 'RTX 4070',
  'RTX 4060 Ti', 'RTX 4060', 'RTX 3090', 'RTX 3080', 'RTX 3070', 'RTX 3060',
  'A100 80GB', 'A100 40GB', 'H100', 'L40S', 'A6000', 'RTX A5000',
];

export const LOCATION_OPTIONS = [
  { value: 'SA', label: 'Saudi Arabia', flag: '🇸🇦' },
  { value: 'AE', label: 'UAE', flag: '🇦🇪' },
  { value: 'BH', label: 'Bahrain', flag: '🇧🇭' },
  { value: 'QA', label: 'Qatar', flag: '🇶🇦' },
  { value: 'KW', label: 'Kuwait', flag: '🇰🇼' },
  { value: 'OM', label: 'Oman', flag: '🇴🇲' },
  { value: 'EG', label: 'Egypt', flag: '🇪🇬' },
  { value: 'OTHER', label: 'Other', flag: '🌍' },
];

// Parse clean GPU name from raw WebGL renderer string
export function parseGPUName(raw: string): { clean: string; vendor: 'nvidia' | 'amd' | 'intel' | 'apple' | 'software' | 'unknown' } | null {
  if (!raw) return null;

  // Detect software renderers
  if (/Microsoft Basic Render/i.test(raw) || /SwiftShader/i.test(raw)) {
    return { clean: raw, vendor: 'software' };
  }
  // Detect integrated Intel
  if (/Intel\s*(UHD|Iris|HD)/i.test(raw)) {
    const match = raw.match(/(Intel\s*(?:UHD|Iris|HD)\s*Graphics?\s*\w*)/i);
    return { clean: match ? match[1].trim() : 'Intel Integrated Graphics', vendor: 'intel' };
  }
  // Detect Apple Silicon
  if (/Apple\s*(GPU|M\d)/i.test(raw)) {
    const match = raw.match(/(Apple\s*M\d+\s*(?:Pro|Max|Ultra)?)/i);
    return { clean: match ? match[1].trim() : 'Apple GPU', vendor: 'apple' };
  }

  // Extract discrete GPU names
  const gpuPatterns: [RegExp, 'nvidia' | 'amd'][] = [
    [/(GeForce\s*[A-Z]+\s*\d{3,5}\s*(?:Ti|SUPER|XT|XTX)?)/i, 'nvidia'],
    [/(Quadro\s*[A-Z]*\s*\d{3,5}\s*\w*)/i, 'nvidia'],
    [/(Tesla\s*[A-Z]\d+\w*)/i, 'nvidia'],
    [/\b((?:A|H|L)\d{2,3})\b/i, 'nvidia'],
    [/(Radeon\s*(?:RX|Pro)\s*\d{3,5}\s*(?:XT|XTX)?)/i, 'amd'],
  ];

  for (const [pattern, vendor] of gpuPatterns) {
    const match = raw.match(pattern);
    if (match) {
      const clean = match[1].trim();
      const prefix = vendor === 'nvidia' && !clean.startsWith('Radeon') ? 'NVIDIA ' : (vendor === 'amd' ? 'AMD ' : '');
      return { clean: `${prefix}${clean}`, vendor };
    }
  }

  // Fallback vendor detection
  const upper = raw.toUpperCase();
  if (upper.includes('NVIDIA') || upper.includes('GEFORCE')) return { clean: raw, vendor: 'nvidia' };
  if (upper.includes('RADEON') || upper.includes('AMD')) return { clean: raw, vendor: 'amd' };

  return { clean: raw, vendor: 'unknown' };
}

// Get a non-discrete GPU message or null if it's discrete
export function getNonDiscreteMessage(raw: string): string | null {
  if (/Microsoft Basic Render/i.test(raw))
    return "Software renderer detected. Your GPU isn't visible to the browser. Enable hardware acceleration in browser settings and refresh, or select your GPU below.";
  if (/Intel\s*(UHD|Iris|HD)/i.test(raw))
    return "Integrated graphics detected (Intel). If you have a dedicated NVIDIA or AMD card, select it below for accurate earnings.";
  if (/SwiftShader/i.test(raw))
    return "Software renderer detected. Select your GPU manually below.";
  if (/Apple\s*(GPU|M\d)/i.test(raw))
    return "Apple Silicon detected. Select your specific chip below.";
  return null;
}

// Auto-match a parsed GPU name to a dropdown entry
export function autoMatchDropdown(cleanName: string): string | null {
  const norm = cleanName.toLowerCase().replace(/\s+/g, '');
  for (const opt of GPU_SELECT_OPTIONS) {
    const optNorm = opt.toLowerCase().replace(/\s+/g, '');
    if (norm.includes(optNorm)) return opt;
  }
  // Try just model number (e.g. "4060")
  const modelNum = cleanName.match(/(\d{4,5})/);
  if (modelNum) {
    for (const opt of GPU_SELECT_OPTIONS) {
      if (opt.includes(modelNum[1])) return opt;
    }
  }
  return null;
}

// WebGL GPU Detection
export function detectGPU(): { renderer: string; vendor: string } | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext)) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return null;

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    return { renderer, vendor };
  } catch {
    return null;
  }
}

export function matchGPU(renderer: string): string | null {
  if (!renderer) return null;

  const patterns: [RegExp, string][] = [
    [/RTX\s*5090/i, 'RTX 5090'],
    [/RTX\s*5080/i, 'RTX 5080'],
    [/RTX\s*4090/i, 'RTX 4090'],
    [/RTX\s*4080/i, 'RTX 4080'],
    [/RTX\s*4070\s*TI/i, 'RTX 4070 Ti'],
    [/RTX\s*4070(?!\s*Ti)/i, 'RTX 4070'],
    [/RTX\s*4060\s*TI/i, 'RTX 4060 Ti'],
    [/RTX\s*4060(?!\s*Ti)/i, 'RTX 4060'],
    [/RTX\s*3090/i, 'RTX 3090'],
    [/RTX\s*3080/i, 'RTX 3080'],
    [/RTX\s*3070/i, 'RTX 3070'],
    [/RTX\s*3060/i, 'RTX 3060'],
    [/A100\s*80/i, 'A100 80GB'],
    [/A100\s*40/i, 'A100 40GB'],
    [/A100/i, 'A100 80GB'],
    [/H100/i, 'H100'],
    [/L40S/i, 'L40S'],
    [/A6000/i, 'A6000'],
    [/RTX\s*A5000/i, 'RTX A5000'],
  ];

  for (const [pattern, name] of patterns) {
    if (pattern.test(renderer)) return name;
  }

  const upper = renderer.toUpperCase();
  if (upper.includes('NVIDIA') || upper.includes('GEFORCE')) {
    return renderer;
  }

  return null;
}

export interface LiveGPUData {
  models?: Array<{
    name: string;
    stats: { all: { all: Array<{ price_median: number }> } };
  }>;
}

export function getMarketPrice(gpuName: string, liveData: LiveGPUData | null): number {
  if (liveData?.models) {
    const found = liveData.models.find(m => m.name === gpuName);
    if (found?.stats?.all?.all?.[0]) {
      return found.stats.all.all[0].price_median;
    }
  }
  return FALLBACK_PRICES[gpuName] || 0.10;
}

export function calcEarnings(gpuName: string, marketPrice: number, utilization: number) {
  const info = GPU_DB[gpuName];
  if (!info) return null;

  const systemTDP = info.tdp * 1.3 / 1000; // kW with overhead
  const hourlyPowerCost = systemTDP * ENERGY.dc1;
  const yourCut = marketPrice * 0.85;
  const netHourly = yourCut - hourlyPowerCost;
  const monthlyHours = 720 * utilization;
  const monthlyEarning = netHourly * monthlyHours;

  return { marketPrice, yourCut, hourlyPowerCost, monthlyEarning };
}

export function calcComparison(gpuName: string, marketPrice: number, utilization: number) {
  const info = GPU_DB[gpuName];
  if (!info) return null;

  const systemTDP = info.tdp * 1.3 / 1000;
  const monthlyHours = 720 * utilization;
  const grossMonthly = marketPrice * 0.85 * monthlyHours;

  function calcNet(energyRate: number) {
    const power = systemTDP * energyRate * 720;
    return { net: grossMonthly - power, power };
  }

  return {
    dc1: calcNet(ENERGY.dc1),
    us: calcNet(ENERGY.us),
    dubai: calcNet(ENERGY.dubai),
    eu: calcNet(ENERGY.eu),
    energyBarPct: Math.round((ENERGY.dc1 / ENERGY.eu) * 100),
  };
}
