// src/utils/calculatorUtils.ts
import type { CalculationResult, CostStatistics } from "../types/calculator";
import {
  DEFAULT_VALUES,
  CONFIDENCE_LEVELS,
} from "../constants/calculatorConstants";

/**
 * 메소 표시 포맷팅
 */
export const formatMeso = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만`;
  } else {
    return amount.toLocaleString();
  }
};

/**
 * 이항분포 계산 함수
 */
export const calculateBinomial = (n: number, k: number, p: number): number => {
  if (k > n) return 0;
  if (k === 0) return Math.pow(1 - p, n);
  if (k === n) return Math.pow(p, n);

  // 조합 계산 (nCk)
  let combination = 1;
  for (let i = 0; i < k; i++) {
    combination = (combination * (n - i)) / (i + 1);
  }

  return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

/**
 * N회 이상 성공 확률 계산
 */
export const calculateNOrMoreSuccess = (
  results: CalculationResult[],
  n: number
): number => {
  if (n <= 0) return 1;
  if (n > results.length - 1) return 0;

  // P(X >= n) = 1 - P(X <= n-1)
  let cumulativeProb = 0;
  for (let i = 0; i < n && i < results.length; i++) {
    cumulativeProb += results[i].probability;
  }
  return 1 - cumulativeProb;
};

/**
 * 목표 달성을 위한 필요 시행 횟수 계산
 */
export const calculateTrialsForTarget = (
  probability: number,
  targetSuccesses: number,
  targetConfidence: number
): number => {
  if (targetSuccesses <= 0) return 0;
  if (probability <= 0) return DEFAULT_VALUES.MAX_TRIALS;
  if (probability >= 1) return targetSuccesses;

  // 이진 탐색으로 필요한 시행 횟수 찾기
  let left = targetSuccesses;
  let right = Math.min(
    DEFAULT_VALUES.MAX_TRIALS,
    Math.max(100, targetSuccesses * 20)
  );
  let iterations = 0;

  while (left < right && iterations < DEFAULT_VALUES.MAX_ITERATIONS) {
    iterations++;
    const mid = Math.floor((left + right) / 2);
    let successProb = 0;

    // targetSuccesses 이상 성공할 확률 계산
    for (let k = targetSuccesses; k <= mid; k++) {
      const prob = calculateBinomial(mid, k, probability);
      successProb += prob;
      if (successProb >= targetConfidence) break;
    }

    if (successProb >= targetConfidence) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return Math.min(left, DEFAULT_VALUES.MAX_TRIALS);
};

/**
 * 비용 통계 계산 (목표 기반)
 */
export const calculateTargetCostStatistics = (
  scrollPrice: number,
  probability: number,
  targetSuccesses: number
): CostStatistics => {
  const trials5Percent = calculateTrialsForTarget(
    probability,
    targetSuccesses,
    CONFIDENCE_LEVELS.VERY_LUCKY
  );
  const trials50Percent = calculateTrialsForTarget(
    probability,
    targetSuccesses,
    CONFIDENCE_LEVELS.FIFTY_FIFTY
  );
  const trials90Percent = calculateTrialsForTarget(
    probability,
    targetSuccesses,
    CONFIDENCE_LEVELS.VERY_LIKELY
  );
  const trials99Percent = calculateTrialsForTarget(
    probability,
    targetSuccesses,
    CONFIDENCE_LEVELS.ALMOST_CERTAIN
  );

  // 기댓값 계산 (목표 달성까지 필요한 평균 시행 횟수)
  const expectedTrials = targetSuccesses / probability;
  const expectedCost = expectedTrials * scrollPrice;

  return {
    expectedCost,
    cost5Percent: trials5Percent * scrollPrice,
    cost50Percent: trials50Percent * scrollPrice,
    cost90Percent: trials90Percent * scrollPrice,
    cost99Percent: trials99Percent * scrollPrice,
    trials5Percent,
    trials50Percent,
    trials90Percent,
    trials99Percent,
  };
};

/**
 * 확률 계산 결과 생성
 */
export const generateCalculationResults = (
  probability: number,
  trials: number
): CalculationResult[] => {
  const results: CalculationResult[] = [];
  let cumulativeProb = 0;

  for (let i = 0; i <= trials; i++) {
    const prob = calculateBinomial(trials, i, probability);
    cumulativeProb += prob;

    results.push({
      successCount: i,
      probability: prob,
      cumulativeProbability: cumulativeProb,
    });
  }

  return results;
};
