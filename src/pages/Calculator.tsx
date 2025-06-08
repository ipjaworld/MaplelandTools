// src/pages/Calculator.tsx
import React, { useState } from "react";
import { useCalculator } from "../contexts/CalculatorContext";
import { Calculator as CalcIcon } from "lucide-react";
import CalculatorInputPanel from "@/components/calculator/CalculatorInputPanel";
import CalculatorResultPanel from "@/components/calculator/CalculatorResultPanel";
import type { CalculatorInputs, CalculationMode } from "../types/calculator";
import { DEFAULT_VALUES } from "../constants/calculatorConstants";
import {
  generateCalculationResults,
  calculateTargetCostStatistics,
  calculateNOrMoreSuccess,
} from "../utils/calculatorUtils";

const Calculator: React.FC = () => {
  const { state, setProbability, setTrials, setResults, addToHistory } =
    useCalculator();

  // 입력 상태들을 하나의 객체로 관리
  const [inputs, setInputs] = useState<CalculatorInputs>({
    localProbability: DEFAULT_VALUES.PROBABILITY,
    localTrials: DEFAULT_VALUES.TRIALS,
    scrollPrice: DEFAULT_VALUES.SCROLL_PRICE,
    targetSuccess: DEFAULT_VALUES.TARGET_SUCCESS,
    minSuccessCount: DEFAULT_VALUES.MIN_SUCCESS_COUNT,
    calculationMode: "target" as CalculationMode,
  });

  // 입력값 변경 핸들러
  const handleInputChange = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // 계산 실행
  const handleCalculate = () => {
    const probability = inputs.localProbability / 100;
    const trials = inputs.localTrials;

    setProbability(probability);
    setTrials(trials);

    const results = generateCalculationResults(probability, trials);
    setResults(results);

    // 히스토리에 추가
    addToHistory({
      probability,
      trials,
      results,
    });
  };

  // 리셋
  const handleReset = () => {
    setInputs({
      localProbability: DEFAULT_VALUES.PROBABILITY,
      localTrials: DEFAULT_VALUES.TRIALS,
      scrollPrice: DEFAULT_VALUES.SCROLL_PRICE,
      targetSuccess: DEFAULT_VALUES.TARGET_SUCCESS,
      minSuccessCount: DEFAULT_VALUES.MIN_SUCCESS_COUNT,
      calculationMode: "target",
    });
    setResults([]);
  };

  // 계산된 값들
  const costStats =
    state.results.length > 0 && inputs.calculationMode === "target"
      ? calculateTargetCostStatistics(
          inputs.scrollPrice,
          state.probability,
          inputs.targetSuccess
        )
      : null;

  const nOrMoreSuccessProb =
    state.results.length > 0
      ? calculateNOrMoreSuccess(
          state.results,
          inputs.calculationMode === "target" ? 1 : inputs.minSuccessCount
        )
      : 0;

  return (
    <div className="h-full w-full max-w-[1220px] mx-auto">
      {/* 페이지 헤더 */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <CalcIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            메이플랜드 확률 계산기
          </h1>
        </div>
        <p className="text-slate-400 text-lg mb-4">
          메이플랜드 주문서, 가챠 아이템의 목표 달성 확률과 예상 비용을 정확히
          계산해보세요
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-none">
        {/* 입력 패널 */}
        <div className="xl:col-span-4">
          <CalculatorInputPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        </div>

        {/* 결과 패널 */}
        <div className="xl:col-span-8">
          <CalculatorResultPanel
            state={state}
            costStats={costStats}
            nOrMoreSuccessProb={nOrMoreSuccessProb}
            calculationMode={inputs.calculationMode}
            targetSuccess={inputs.targetSuccess}
            minSuccessCount={inputs.minSuccessCount}
            scrollPrice={inputs.scrollPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
