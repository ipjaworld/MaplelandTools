// src/components/CalculatorResultPanel.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Save,
  Calculator as CalcIcon,
  TrendingUp,
  Target,
  DollarSign,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react';
import type { CalculatorState, CostStatistics, CalculationMode } from '@/types/calculator';
import { formatMeso } from '@/utils/calculatorUtils';

interface CalculatorResultPanelProps {
  state: CalculatorState;
  costStats: CostStatistics | null;
  nOrMoreSuccessProb: number;
  calculationMode: CalculationMode;
  targetSuccess: number;
  minSuccessCount: number;
  scrollPrice: number;
}

const CalculatorResultPanel: React.FC<CalculatorResultPanelProps> = ({
  state,
  costStats,
  nOrMoreSuccessProb,
  calculationMode,
  targetSuccess,
  minSuccessCount,
  scrollPrice,
}) => {
  if (state.results.length === 0) {
    return (
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>계산 결과</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-700/30 rounded-full flex items-center justify-center">
                <CalcIcon className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-lg">계산 결과가 여기에 표시됩니다</p>
                <p className="text-slate-500 text-sm">위에서 값을 입력하고 '계산하기' 버튼을 눌러주세요</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>계산 결과</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-700/30 border-slate-600/50 text-slate-300"
          >
            <Save size={14} className="mr-1" />
            저장
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="flex flex-col h-full space-y-6">
          {/* 목표 달성 비용 정보 - 목표 달성 모드에서만 */}
          {costStats && calculationMode === 'target' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-300 text-xs font-medium mb-1">평균 예상 비용</p>
                  <p className="text-lg font-bold text-blue-400">
                    {formatMeso(costStats.expectedCost)}
                  </p>
                  <p className="text-xs text-blue-300/70 mt-1">{targetSuccess}회 달성 기댓값</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 text-xs font-medium mb-1">운 좋으면 (5%)</p>
                  <p className="text-lg font-bold text-green-400">
                    {formatMeso(costStats.cost5Percent)}
                  </p>
                  <p className="text-xs text-green-300/70 mt-1">{costStats.trials5Percent}회 시행</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-amber-300 text-xs font-medium mb-1">절반 확률 (50%)</p>
                  <p className="text-lg font-bold text-amber-400">
                    {formatMeso(costStats.cost50Percent)}
                  </p>
                  <p className="text-xs text-amber-300/70 mt-1">{costStats.trials50Percent}회 시행</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-red-300 text-xs font-medium mb-1">거의 확실 (99%)</p>
                  <p className="text-lg font-bold text-red-400">
                    {formatMeso(costStats.cost99Percent)}
                  </p>
                  <p className="text-xs text-red-300/70 mt-1">{costStats.trials99Percent}회 시행</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 확률 분석 정보 - 확률 분석 모드에서만 */}
          {calculationMode === 'probability' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-purple-300 text-sm font-medium mb-2">
                    {minSuccessCount}회 이상 성공 확률
                  </p>
                  <p className="text-3xl font-bold text-purple-400">
                    {(nOrMoreSuccessProb * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-300/70 mt-2">{state.trials}회 시행 기준</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-indigo-300 text-sm font-medium mb-2">예상 성공 횟수</p>
                  <p className="text-3xl font-bold text-indigo-400">
                    {(state.probability * state.trials).toFixed(1)}회
                  </p>
                  <p className="text-xs text-indigo-300/70 mt-2">평균 기댓값</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <p className="text-teal-300 text-sm font-medium mb-2">개별 성공 확률</p>
                  <p className="text-3xl font-bold text-teal-400">
                    {(state.probability * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-teal-300/70 mt-2">시행당 확률</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 기본 통계 정보 - 목표 달성 모드에서만 */}
          {calculationMode === 'target' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-purple-300 text-sm font-medium mb-1">성공 확률</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(state.probability * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-indigo-300 text-sm font-medium mb-1">목표 횟수</p>
                  <p className="text-2xl font-bold text-indigo-400">{targetSuccess}회</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-teal-300 text-sm font-medium mb-1">평균 시행수</p>
                  <p className="text-2xl font-bold text-teal-400">
                    {(targetSuccess / state.probability).toFixed(1)}회
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-emerald-300 text-sm font-medium mb-1">1회 이상 성공</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {(nOrMoreSuccessProb * 100).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상세 결과 테이블 */}
          <Card className="bg-slate-900/30 border-slate-700/30 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-200 text-lg">상세 확률 분포</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <div className="h-full overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-800/80 backdrop-blur-sm">
                    <TableRow className="border-slate-700/50 hover:bg-transparent">
                      <TableHead className="text-slate-300 font-medium">성공 횟수</TableHead>
                      <TableHead className="text-right text-slate-300 font-medium">
                        개별 확률
                      </TableHead>
                      <TableHead className="text-right text-slate-300 font-medium">
                        누적 확률
                      </TableHead>
                      <TableHead className="text-right text-slate-300 font-medium">
                        누적 비용
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.results.slice(0, 50).map((result, index) => (
                      <TableRow
                        key={result.successCount}
                        className="border-slate-700/30 hover:bg-slate-700/10 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-300">
                          {result.successCount}회
                        </TableCell>
                        <TableCell className="text-right text-slate-400">
                          {(result.probability * 100).toFixed(4)}%
                        </TableCell>
                        <TableCell className="text-right text-slate-400">
                          {(result.cumulativeProbability * 100).toFixed(4)}%
                        </TableCell>
                        <TableCell className="text-right text-slate-400">
                          {formatMeso((index + 1) * scrollPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {state.results.length > 50 && (
                <div className="p-4 text-center text-sm text-slate-500 border-t border-slate-700/30">
                  상위 50개 결과만 표시됩니다. 전체 {state.results.length}개 결과
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorResultPanel;