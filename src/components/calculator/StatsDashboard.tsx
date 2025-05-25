// components/calculator/StatsDashboard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Calculator,
  Percent,
  Timer,
  Award
} from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';
import { 
  calculateExpectedValue, 
  calculateVariance, 
  calculateStandardDeviation,
  calculateGeometricExpectedValue 
} from '../../utils/probability';

interface StatsDashboardProps {
  results: CalculationResult[];
  probability: number;
  trials: number;
}

// 간단한 프로그레스 바 컴포넌트
const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`w-full bg-slate-700 rounded-full h-2 overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  results,
  probability,
  trials
}) => {
  const statistics = useMemo(() => {
    if (results.length === 0) return null;

    const expectedValue = calculateExpectedValue(trials, probability);
    const variance = calculateVariance(trials, probability);
    const standardDeviation = calculateStandardDeviation(trials, probability);
    
    // 최빈값 (가장 높은 확률을 가진 성공 횟수)
    const mode = results.reduce((max, current) => 
      current.probability > max.probability ? current : max
    ).successCount;

    // 중앙값 근사 (기댓값과 거의 같음)
    const median = Math.round(expectedValue);

    // 1회 이상 성공할 확률
    const atLeastOneSuccess = 1 - results[0].probability;

    // 기댓값 이상 성공할 확률
    const aboveExpected = results
      .filter(r => r.successCount >= expectedValue)
      .reduce((sum, r) => sum + r.probability, 0);

    // 첫 번째 성공까지의 기댓값 (기하분포)
    const firstSuccessExpected = calculateGeometricExpectedValue(probability);

    // 성공률 구간별 분석
    const successRanges = {
      none: results[0].probability,
      low: results.filter(r => r.successCount > 0 && r.successCount < expectedValue * 0.5)
        .reduce((sum, r) => sum + r.probability, 0),
      medium: results.filter(r => r.successCount >= expectedValue * 0.5 && r.successCount < expectedValue * 1.5)
        .reduce((sum, r) => sum + r.probability, 0),
      high: results.filter(r => r.successCount >= expectedValue * 1.5)
        .reduce((sum, r) => sum + r.probability, 0)
    };

    return {
      expectedValue,
      variance,
      standardDeviation,
      mode,
      median,
      atLeastOneSuccess,
      aboveExpected,
      firstSuccessExpected,
      successRanges
    };
  }, [results, probability, trials]);

  if (!statistics) {
    return (
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>통계 대시보드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p>계산 후 통계가 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 메인 통계 카드 */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>통계 대시보드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 기댓값 */}
            <div className="text-center p-4 bg-slate-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-1">기댓값</p>
              <p className="text-xl font-bold text-blue-400">
                {statistics.expectedValue.toFixed(1)}
              </p>
              <p className="text-slate-500 text-xs">평균 성공 횟수</p>
            </div>

            {/* 표준편차 */}
            <div className="text-center p-4 bg-slate-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-1">표준편차</p>
              <p className="text-xl font-bold text-green-400">
                {statistics.standardDeviation.toFixed(1)}
              </p>
              <p className="text-slate-500 text-xs">결과의 분산도</p>
            </div>

            {/* 최빈값 */}
            <div className="text-center p-4 bg-slate-900/30 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-1">최빈값</p>
              <p className="text-xl font-bold text-yellow-400">
                {statistics.mode}
              </p>
              <p className="text-slate-500 text-xs">가장 높은 확률</p>
            </div>

            {/* 1회 이상 성공 */}
            <div className="text-center p-4 bg-slate-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-1">1회 이상</p>
              <p className="text-xl font-bold text-purple-400">
                {(statistics.atLeastOneSuccess * 100).toFixed(1)}%
              </p>
              <p className="text-slate-500 text-xs">성공 확률</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 성공률 구간 분석 */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <Percent className="w-5 h-5 text-orange-400" />
            <span>성공률 구간 분석</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 실패 (0회 성공) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">실패 (0회)</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {(statistics.successRanges.none * 100).toFixed(1)}%
              </Badge>
            </div>
            <ProgressBar value={statistics.successRanges.none * 100} />
          </div>

          {/* 낮은 성공률 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">
                낮은 성공 (1~{Math.floor(statistics.expectedValue * 0.5)}회)
              </span>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {(statistics.successRanges.low * 100).toFixed(1)}%
              </Badge>
            </div>
            <ProgressBar value={statistics.successRanges.low * 100} />
          </div>

          {/* 보통 성공률 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">
                보통 성공 ({Math.floor(statistics.expectedValue * 0.5)}~{Math.floor(statistics.expectedValue * 1.5)}회)
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {(statistics.successRanges.medium * 100).toFixed(1)}%
              </Badge>
            </div>
            <ProgressBar value={statistics.successRanges.medium * 100} />
          </div>

          {/* 높은 성공률 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">
                높은 성공 ({Math.floor(statistics.expectedValue * 1.5)}회 이상)
              </span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {(statistics.successRanges.high * 100).toFixed(1)}%
              </Badge>
            </div>
            <ProgressBar value={statistics.successRanges.high * 100} />
          </div>
        </CardContent>
      </Card>

      {/* 추가 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200 text-lg">
              <Timer className="w-5 h-5 text-cyan-400" />
              <span>기하분포 분석</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">첫 성공까지 평균</span>
                <span className="text-cyan-400 font-semibold">
                  {statistics.firstSuccessExpected.toFixed(1)}회
                </span>
              </div>
              <div className="text-xs text-slate-500">
                첫 번째 성공이 나올 때까지 평균적으로 필요한 시행 횟수
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200 text-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>확률 비교</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">기댓값 이상 성공</span>
                <span className="text-indigo-400 font-semibold">
                  {(statistics.aboveExpected * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-slate-500">
                기댓값보다 좋은 결과가 나올 확률
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsDashboard;