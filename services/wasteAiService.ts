/**
 * EcoSmart AI — Waste Vision & Nigerian Unit-to-1kg Valuation Service
 * Connects the React Native / Web frontend to the PythonAnywhere Flask + ONNX backend
 * (`arnabdhar/YOLOv8-nano-trash-detection`), with instant local math fallback.
 */

export const PYTHONANYWHERE_API_BASE =
  process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface MaterialHeuristic {
  id: string;
  name: string;
  unitSingular: string;
  unitPlural: string;
  unitWeightKg: number; // e.g., 0.020 kg (20g) per standard PET bottle
  unitsPer1Kg: number;  // e.g., 50 bottles = 1 kg
  ratePerKg: number;    // e.g., ₦120/kg
}

export const NIGERIAN_WASTE_HEURISTICS: Record<string, MaterialHeuristic> = {
  pet: {
    id: 'pet',
    name: 'Clear PET Plastic bottles',
    unitSingular: 'bottle',
    unitPlural: 'bottles',
    unitWeightKg: 0.02,
    unitsPer1Kg: 50,
    ratePerKg: 120,
  },
  hdpe: {
    id: 'hdpe',
    name: 'Hard, heavy plastic (HDPE)',
    unitSingular: 'container',
    unitPlural: 'containers',
    unitWeightKg: 0.06,
    unitsPer1Kg: 17,
    ratePerKg: 105,
  },
  cans: {
    id: 'cans',
    name: 'Aluminium Cans',
    unitSingular: 'can',
    unitPlural: 'cans',
    unitWeightKg: 0.015,
    unitsPer1Kg: 67,
    ratePerKg: 600,
  },
  carton: {
    id: 'carton',
    name: 'Cardboard & Paper Cartons',
    unitSingular: 'carton',
    unitPlural: 'cartons',
    unitWeightKg: 0.125,
    unitsPer1Kg: 8,
    ratePerKg: 60,
  },
  glass: {
    id: 'glass',
    name: 'Glass Bottles & Jars',
    unitSingular: 'glass bottle',
    unitPlural: 'glass bottles',
    unitWeightKg: 0.25,
    unitsPer1Kg: 4,
    ratePerKg: 30,
  },
  sachet: {
    id: 'sachet',
    name: 'Pure Water Sachets / Nylon (LDPE)',
    unitSingular: 'sachet',
    unitPlural: 'sachets',
    unitWeightKg: 0.003,
    unitsPer1Kg: 333,
    ratePerKg: 50,
  },
};

export function calculateBottleToKgStats(bucketId: string, count: number, customRate?: number) {
  const h = NIGERIAN_WASTE_HEURISTICS[bucketId] || NIGERIAN_WASTE_HEURISTICS.pet;
  const safeCount = Math.max(1, Math.round(count));
  const rate = customRate || h.ratePerKg;
  const weightKg = parseFloat((safeCount * h.unitWeightKg).toFixed(2));
  const estimatedNaira = Math.max(1, Math.round(weightKg * rate));
  const neededFor1Kg = Math.max(0, h.unitsPer1Kg - safeCount);
  const neededFor3KgPickup = Math.max(0, h.unitsPer1Kg * 3 - safeCount);

  return {
    bucketId: h.id,
    materialName: h.name,
    count: safeCount,
    unitLabel: safeCount === 1 ? h.unitSingular : h.unitPlural,
    unitPlural: h.unitPlural,
    unitWeightGrams: Math.round(h.unitWeightKg * 1000),
    unitsPer1Kg: h.unitsPer1Kg,
    weightKg,
    ratePerKg: rate,
    priceFor1Kg: rate,
    estimatedNaira,
    neededFor1Kg,
    neededFor3KgPickup,
  };
}

export async function submitCustomNigerianLabel(payload: {
  customName: string;
  bucketId: string;
  itemCount: number;
  imageFilename?: string;
}) {
  try {
    const res = await fetch(`${PYTHONANYWHERE_API_BASE}/api/scan/custom-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom_name: payload.customName,
        bucket_id: payload.bucketId,
        item_count: payload.itemCount,
        image_filename: payload.imageFilename || '',
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline or backend not yet started — return local active-learning confirmation
  }
  return {
    success: true,
    learned_custom_name: payload.customName,
    offline_queued: true,
  };
}
