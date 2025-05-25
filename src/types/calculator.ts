// src/types/calculator.ts
export interface CalculationResult {
  successCount: number;
  probability: number;
  cumulativeProbability: number;
}

export interface CostStatistics {
  expectedCost: number;
  cost5Percent: number; // 5% 확률로 성공하는 비용 (운 좋은 경우)
  cost50Percent: number; // 50% 확률로 성공하는 비용 (중간)
  cost90Percent: number; // 90% 확률로 성공하는 비용
  cost99Percent: number; // 99% 확률로 성공하는 비용 (최악의 경우)
  trials5Percent: number;
  trials50Percent: number;
  trials90Percent: number;
  trials99Percent: number;
}

export interface CalculatorState {
  probability: number;
  trials: number;
  results: CalculationResult[];
  isCalculating: boolean;
  history: CalculationHistory[];
}

export interface CalculationHistory {
  id: string;
  probability: number;
  trials: number;
  timestamp: Date;
  results: CalculationResult[];
  itemPrice?: number; // 아이템 가격 추가
  notes?: string; // 메모 기능
}

// 🔧 수정: 메이플랜드에 맞는 카테고리만 남김
export interface ProbabilityPreset {
  label: string;
  value: number;
  description: string;
  color: string;
  category: "mapleland" | "gacha" | "custom";
  estimatedCost?: string; // 예상 비용 범위
}

// 메이플랜드 주문서 프리셋 (10%, 60%, 100%만)
export const MAPLELAND_SCROLLS: ProbabilityPreset[] = [
  {
    label: "10%",
    value: 10,
    description: "일반 주문서",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    category: "mapleland",
    estimatedCost: "100만~1억",
  },
  {
    label: "60%",
    value: 60,
    description: "안전한 주문서",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    category: "mapleland",
    estimatedCost: "10만~100만",
  },
  {
    label: "100%",
    value: 100,
    description: "확정 주문서",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    category: "mapleland",
    estimatedCost: "5만~50만",
  },
];

// 가챠 프리셋 (일반적인 가챠 확률)
export const GACHA_PRESETS: ProbabilityPreset[] = [
  {
    label: "1%",
    value: 1,
    description: "레어 가챠",
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

export type CalculatorAction =
  | { type: "SET_PROBABILITY"; payload: number }
  | { type: "SET_TRIALS"; payload: number }
  | { type: "SET_RESULTS"; payload: CalculationResult[] }
  | { type: "SET_CALCULATING"; payload: boolean }
  | { type: "ADD_TO_HISTORY"; payload: CalculationHistory }
  | { type: "UPDATE_HISTORY_NOTE"; payload: { id: string; notes: string } }
  | { type: "REMOVE_FROM_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "RESET_CALCULATOR" };

// 유틸리티 타입
export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description?: string;
}

// 확률 계산 유틸리티 타입
export interface BinomialCalculation {
  n: number; // 시행 횟수
  k: number; // 성공 횟수
  p: number; // 성공 확률
}

export interface ExpectedValueCalculation {
  probability: number;
  itemPrice: number;
  expectedTrials: number;
  expectedCost: number;
}

// Calculator 컴포넌트에서 사용하는 추가 타입들
export type CalculationMode = "target" | "probability";

export interface CalculatorInputs {
  localProbability: number;
  localTrials: number;
  scrollPrice: number;
  targetSuccess: number;
  minSuccessCount: number;
  calculationMode: CalculationMode;
}