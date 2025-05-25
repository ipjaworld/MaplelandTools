// utils/probability.ts

/**
 * 조합 계산 (nCk)
 * @param n 전체 개수
 * @param k 선택할 개수
 * @returns n개 중 k개를 선택하는 경우의 수
 */
export const calculateCombination = (n: number, k: number): number => {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;

  // 계산 최적화: k > n-k인 경우 k = n-k로 변경
  if (k > n - k) {
    k = n - k;
  }

  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }

  return Math.round(result);
};

/**
 * 이항분포 확률 계산
 * @param n 시행 횟수
 * @param k 성공 횟수
 * @param p 성공 확률 (0~1)
 * @returns k번 성공할 확률
 */
export const calculateBinomial = (n: number, k: number, p: number): number => {
  if (k > n || k < 0) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;

  const combination = calculateCombination(n, k);
  return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

/**
 * 이항분포의 기댓값 계산
 * @param n 시행 횟수
 * @param p 성공 확률
 * @returns 기댓값
 */
export const calculateExpectedValue = (n: number, p: number): number => {
  return n * p;
};

/**
 * 이항분포의 분산 계산
 * @param n 시행 횟수
 * @param p 성공 확률
 * @returns 분산
 */
export const calculateVariance = (n: number, p: number): number => {
  return n * p * (1 - p);
};

/**
 * 이항분포의 표준편차 계산
 * @param n 시행 횟수
 * @param p 성공 확률
 * @returns 표준편차
 */
export const calculateStandardDeviation = (n: number, p: number): number => {
  return Math.sqrt(calculateVariance(n, p));
};

/**
 * 누적 이항분포 확률 계산 (k번 이하 성공할 확률)
 * @param n 시행 횟수
 * @param k 성공 횟수 상한
 * @param p 성공 확률
 * @returns k번 이하 성공할 확률
 */
export const calculateCumulativeBinomial = (
  n: number,
  k: number,
  p: number
): number => {
  let cumulative = 0;
  for (let i = 0; i <= k; i++) {
    cumulative += calculateBinomial(n, i, p);
  }
  return cumulative;
};

/**
 * 베르누이 시행에서 첫 번째 성공까지의 기댓값 (기하분포)
 * @param p 성공 확률
 * @returns 첫 번째 성공까지의 평균 시행 횟수
 */
export const calculateGeometricExpectedValue = (p: number): number => {
  if (p <= 0 || p > 1) throw new Error("확률은 0보다 크고 1 이하여야 합니다.");
  return 1 / p;
};

/**
 * 확률 값 검증
 * @param probability 확률 값 (0~100 또는 0~1)
 * @returns 정규화된 확률 값 (0~1)
 */
export const normalizeProbability = (probability: number): number => {
  if (probability < 0) return 0;
  if (probability > 100) return 1;
  if (probability > 1) return probability / 100;
  return probability;
};

/**
 * 확률을 퍼센트 문자열로 변환
 * @param probability 확률 값 (0~1)
 * @param decimals 소수점 자릿수
 * @returns 퍼센트 문자열
 */
export const formatProbabilityAsPercent = (
  probability: number,
  decimals = 2
): string => {
  return `${(probability * 100).toFixed(decimals)}%`;
};

/**
 * 시뮬레이션을 통한 확률 검증
 * @param trials 시행 횟수
 * @param probability 성공 확률
 * @param simulations 시뮬레이션 횟수
 * @returns 시뮬레이션 결과 통계
 */
export const simulateTrials = (
  trials: number,
  probability: number,
  simulations: number = 10000
): {
  results: number[];
  average: number;
  expectedValue: number;
  variance: number;
} => {
  const results: number[] = [];

  for (let sim = 0; sim < simulations; sim++) {
    let successes = 0;
    for (let trial = 0; trial < trials; trial++) {
      if (Math.random() < probability) {
        successes++;
      }
    }
    results.push(successes);
  }

  const average = results.reduce((sum, val) => sum + val, 0) / simulations;
  const expectedValue = calculateExpectedValue(trials, probability);
  const variance =
    results.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
    simulations;

  return {
    results,
    average,
    expectedValue,
    variance,
  };
};
