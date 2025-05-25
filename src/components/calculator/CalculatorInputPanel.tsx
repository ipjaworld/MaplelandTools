import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Play, RotateCcw, Target } from "lucide-react";
import type { CalculatorInputs } from "@/types/calculator";
import { MAPLELAND_SCROLLS, GACHA_PRESETS } from "@/types/calculator";
import { formatMeso } from "@/utils/calculatorUtils";

interface CalculatorInputPanelProps {
  inputs: CalculatorInputs;
  onInputChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => void;
  onCalculate: () => void;
  onReset: () => void;
}

const CalculatorInputPanel: React.FC<CalculatorInputPanelProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
}) => {
  const setPresetProbability = (prob: number) => {
    onInputChange("localProbability", prob);
  };

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <div className="flex justify-between items-center w-full">
            <div className="flex">
              <Target className="w-5 h-5 text-blue-400" />
              <span>계산 설정</span>
            </div>
            {/* 액션 버튼들 */}
            <div className="flex space-x-3">
              <Button
                onClick={onReset}
                variant="outline"
                className="bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30 h-12"
              >
                <RotateCcw size={16} className="hover:rotate-[90]" />
              </Button>
              <Button
                onClick={onCalculate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-12 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play size={16} className="mr-2" />
                계산하기
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 계산 모드 선택 */}
        <div className="space-y-4">
          <Label className="text-slate-300 font-medium">계산 모드</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onInputChange("calculationMode", "target")}
              className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                inputs.calculationMode === "target"
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                  : "bg-slate-900/20 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
              }`}
            >
              <div className="font-medium mb-1">🎯 목표 달성</div>
              <div className="text-xs opacity-80">비용 계산</div>
            </button>
            <button
              type="button"
              onClick={() => onInputChange("calculationMode", "probability")}
              className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                inputs.calculationMode === "probability"
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                  : "bg-slate-900/20 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
              }`}
            >
              <div className="font-medium mb-1">📊 확률 분석</div>
              <div className="text-xs opacity-80">성공 확률</div>
            </button>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              inputs.calculationMode === "target"
                ? "bg-blue-900/20 border-blue-500/30"
                : "bg-purple-900/20 border-purple-500/30"
            }`}
          >
            <p
              className={`text-xs font-medium mb-1 ${
                inputs.calculationMode === "target"
                  ? "text-blue-300"
                  : "text-purple-300"
              }`}
            >
              {inputs.calculationMode === "target"
                ? "🎯 목표 달성 모드"
                : "📊 확률 분석 모드"}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {inputs.calculationMode === "target"
                ? "목표 성공 횟수를 달성하는데 필요한 비용과 시행 횟수를 계산합니다."
                : "정해진 시행 횟수 내에서 최소 N회 이상 성공할 확률을 계산합니다."}
            </p>
          </div>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* 성공 확률 입력 */}
        <div className="space-y-4">
          <Label htmlFor="probability" className="text-slate-300 font-medium">
            성공 확률 (%)
          </Label>
          <Input
            id="probability"
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={inputs.localProbability}
            onChange={(e) =>
              onInputChange("localProbability", Number(e.target.value))
            }
            placeholder="10"
            className="bg-slate-900/50 border-slate-600/50 text-slate-200 text-lg h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
          />

          {/* 메이플랜드 프리셋 */}
          <div className="space-y-3">
            <Label className="text-xs text-slate-400 uppercase tracking-wider">
              메이플랜드 주문서
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {MAPLELAND_SCROLLS.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setPresetProbability(preset.value)}
                  className={`${preset.color} hover:scale-105 transition-all duration-200 border text-sm font-medium`}
                  title={preset.description}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 가챠/커스텀 프리셋 */}
          <div className="space-y-3">
            <Label className="text-xs text-slate-400 uppercase tracking-wider">
              가챠 / 기타
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {GACHA_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setPresetProbability(preset.value)}
                  className={`${preset.color} hover:scale-105 transition-all duration-200 border text-sm font-medium`}
                  title={preset.description}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* 목표 성공 횟수 입력 */}
        <div className="space-y-4">
          <Label htmlFor="target" className="text-slate-300 font-medium">
            목표 성공 횟수
          </Label>
          <Input
            id="target"
            type="number"
            min="1"
            max="100"
            value={inputs.targetSuccess}
            onChange={(e) =>
              onInputChange("targetSuccess", Number(e.target.value))
            }
            placeholder="1"
            className="bg-slate-900/50 border-slate-600/50 text-slate-200 text-lg h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          <p className="text-xs text-slate-500">
            몇 번 성공하는 것이 목표인지 설정하세요
          </p>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* N회 이상 성공 확률 계산용 입력 */}
        <div className="space-y-4">
          <Label htmlFor="minSuccess" className="text-slate-300 font-medium">
            최소 성공 횟수
          </Label>
          <Input
            id="minSuccess"
            type="number"
            min="1"
            max="100"
            value={inputs.minSuccessCount}
            onChange={(e) =>
              onInputChange("minSuccessCount", Number(e.target.value))
            }
            placeholder="1"
            className="bg-slate-900/50 border-slate-600/50 text-slate-200 text-lg h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          <p className="text-xs text-slate-500">
            최소 몇 번 이상 성공할 확률을 볼지 설정하세요
          </p>
        </div>

        {/* 아이템 가격 입력 */}
        <div className="space-y-4">
          <Label htmlFor="price" className="text-slate-300 font-medium">
            아이템 가격 (메소)
          </Label>
          <Input
            id="price"
            type="number"
            min="1"
            value={inputs.scrollPrice}
            onChange={(e) =>
              onInputChange("scrollPrice", Number(e.target.value))
            }
            placeholder="1000000"
            className="bg-slate-900/50 border-slate-600/50 text-slate-200 text-lg h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          <p className="text-xs text-slate-500">
            현재 설정: {formatMeso(inputs.scrollPrice)} 메소
          </p>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* 시행 횟수 입력 */}
        <div className="space-y-4">
          <Label htmlFor="trials" className="text-slate-300 font-medium">
            최대 시행 횟수
          </Label>
          <Input
            id="trials"
            type="number"
            min="1"
            max="1000"
            value={inputs.localTrials}
            onChange={(e) =>
              onInputChange("localTrials", Number(e.target.value))
            }
            placeholder="100"
            className="bg-slate-900/50 border-slate-600/50 text-slate-200 text-lg h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>

        <Separator className="bg-slate-700/50" />
      </CardContent>
    </Card>
  );
};

export default CalculatorInputPanel;
