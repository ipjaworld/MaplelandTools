// src/constants/calculatorConstants.ts
import { MAPLELAND_SCROLLS, GACHA_PRESETS } from "../types/calculator";

// 기존 타입 파일의 프리셋들을 재export
export const MAPLELAND_PRESETS = MAPLELAND_SCROLLS;
export const CUSTOM_PRESETS = GACHA_PRESETS;

export const DEFAULT_VALUES = {
  PROBABILITY: 10,
  TRIALS: 100,
  SCROLL_PRICE: 1000000,
  TARGET_SUCCESS: 1,
  MIN_SUCCESS_COUNT: 1,
  MAX_TRIALS: 1000,
  MAX_ITERATIONS: 50,
} as const;

export const CONFIDENCE_LEVELS = {
  VERY_LUCKY: 0.05,
  FIFTY_FIFTY: 0.5,
  VERY_LIKELY: 0.9,
  ALMOST_CERTAIN: 0.99,
} as const;

// 사이드바에서 사용할 수 있는 추가 프리셋들 (기존과 호환)
export const SIDEBAR_COMMON_PROBABILITIES = [
  {
    label: "10%",
    value: 10,
    description: "일반 주문서",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    label: "15%",
    value: 15,
    description: "강화된 주문서",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    label: "30%",
    value: 30,
    description: "보통 주문서",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    label: "60%",
    value: 60,
    description: "안전한 주문서",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    label: "70%",
    value: 70,
    description: "높은 확률",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];
