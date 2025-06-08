// src/constants/probabilities.ts
import type { ProbabilityPreset } from "../types/calculator";

export const PROBABILITY_PRESETS: ProbabilityPreset[] = [
  // 메이플랜드 주문서 (10%, 60%, 100%만)
  {
    label: "10%",
    value: 10,
    description: "일반 주문서",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    category: "mapleland",
  },
  {
    label: "60%",
    value: 60,
    description: "안전한 주문서",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    category: "mapleland",
  },
  {
    label: "100%",
    value: 100,
    description: "확정 성공",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    category: "mapleland",
  },

  // 가챠 아이템 (일반적인 확률)
  {
    label: "1%",
    value: 1,
    description: "레어 아이템",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    category: "gacha",
  },
  {
    label: "5%",
    value: 5,
    description: "가챠 아이템",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    category: "gacha",
  },
  {
    label: "20%",
    value: 20,
    description: "일반 가챠",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    category: "gacha",
  },
];

export const PROBABILITY_CATEGORIES = {
  mapleland: {
    name: "메이플랜드 주문서",
    description: "아이템 강화 주문서",
    color: "text-blue-400",
  },
  gacha: {
    name: "가챠",
    description: "가챠 아이템 확률",
    color: "text-purple-400",
  },
  custom: {
    name: "사용자 정의",
    description: "직접 입력한 확률",
    color: "text-gray-400",
  },
} as const;
