// components/calculator/ProbabilityChart.tsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from "lucide-react";
import type { CalculationResult } from "../../types/calculator";

interface ProbabilityChartProps {
  results: CalculationResult[];
  trials: number;
  probability: number;
  maxBars?: number;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  results,
  trials,
  probability,
  maxBars = 20,
}) => {
  const chartData = useMemo(() => {
    if (results.length === 0) return [];

    // 확률이 높은 상위 결과들만 표시
    const sortedResults = [...results]
      .sort((a, b) => b.probability - a.probability)
      .slice(0, maxBars);

    const maxProbability = sortedResults[0]?.probability || 0;

    return sortedResults.map((result) => ({
      ...result,
      heightPercentage:
        maxProbability > 0 ? (result.probability / maxProbability) * 100 : 0,
      isExpectedValue:
        Math.abs(result.successCount - probability * trials) < 0.5,
    }));
  }, [results, probability, trials, maxBars]);

  const expectedValue = probability * trials;
  const mode = chartData.length > 0 ? chartData[0].successCount : 0;

  if (results.length === 0) {
    return (
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>확률 분포 차트</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p>계산 결과가 있을 때 차트가 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>확률 분포 차트</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              상위 {Math.min(maxBars, results.length)}개
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 통계 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-900/30 rounded-lg">
            <div className="text-center">
              <p className="text-slate-400 text-sm">기댓값</p>
              <p className="text-slate-200 font-semibold">
                {expectedValue.toFixed(1)}회
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">최빈값</p>
              <p className="text-slate-200 font-semibold">{mode}회</p>
            </div>
            <div className="text-center md:col-span-1 col-span-2">
              <p className="text-slate-400 text-sm">최고 확률</p>
              <p className="text-slate-200 font-semibold">
                {(chartData[0]?.probability * 100 || 0).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 바 차트 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>성공 횟수</span>
              <span>확률</span>
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto">
              {chartData.map((data, index) => (
                <div
                  key={data.successCount}
                  className="flex items-center space-x-3 group hover:bg-slate-700/20 p-2 rounded transition-colors"
                >
                  {/* 성공 횟수 레이블 */}
                  <div className="w-12 text-right text-sm font-mono">
                    <span
                      className={`
                      ${
                        data.isExpectedValue
                          ? "text-green-400 font-bold"
                          : "text-slate-300"
                      }
                    `}
                    >
                      {data.successCount}
                    </span>
                  </div>

                  {/* 바 차트 */}
                  <div className="flex-1 relative h-6 bg-slate-900/50 rounded overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-500 ease-out relative
                        ${
                          data.isExpectedValue
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : index === 0
                              ? "bg-gradient-to-r from-blue-500 to-blue-400"
                              : "bg-gradient-to-r from-slate-600 to-slate-500"
                        }
                      `}
                      style={{ width: `${data.heightPercentage}%` }}
                    >
                      {/* 반짝이는 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>

                    {/* 호버 시 툴팁 */}
                    <div className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {(data.probability * 100).toFixed(3)}%
                    </div>
                  </div>

                  {/* 확률 값 */}
                  <div className="w-16 text-right text-sm font-mono text-slate-400">
                    {(data.probability * 100).toFixed(2)}%
                  </div>

                  {/* 특별한 값 표시 */}
                  {data.isExpectedValue && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">기댓값</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 범례 */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
              <span>최고 확률</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded"></div>
              <span>기댓값</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded"></div>
              <span>일반</span>
            </div>
          </div>

          {/* 추가 정보 */}
          {results.length > maxBars && (
            <div className="text-center text-sm text-slate-500 pt-2">
              전체 {results.length}개 결과 중 상위 {maxBars}개만 표시
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilityChart;
