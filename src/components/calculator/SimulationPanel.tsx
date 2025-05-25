// components/calculator/SimulationPanel.tsx
import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  TrendingUp,
  BarChart3,
  Zap,
  Timer,
  Target,
} from "lucide-react";
import { simulateTrials } from "../../utils/probability";

interface SimulationResult {
  trial: number;
  successes: number;
  runningAverage: number;
  isConverged: boolean;
}

interface SimulationPanelProps {
  probability: number;
  trials: number;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  probability,
  trials,
}) => {
  const [simulationCount, setSimulationCount] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [finalStats, setFinalStats] = useState<any>(null);

  // 시뮬레이션 실행
  const runSimulation = useCallback(async () => {
    if (probability <= 0 || trials <= 0) return;

    setIsRunning(true);
    setIsPaused(false);
    setResults([]);
    setCurrentSimulation(0);

    const simResults: SimulationResult[] = [];
    const p = probability / 100;
    let runningSum = 0;
    const convergenceThreshold = 0.01; // 1% 이내로 수렴

    for (let i = 0; i < simulationCount; i++) {
      if (isPaused) break;

      // 각 시뮬레이션 실행
      let successes = 0;
      for (let j = 0; j < trials; j++) {
        if (Math.random() < p) {
          successes++;
        }
      }

      runningSum += successes;
      const runningAverage = runningSum / (i + 1);
      const expectedValue = p * trials;
      const isConverged =
        Math.abs(runningAverage - expectedValue) / expectedValue <
        convergenceThreshold;

      const result: SimulationResult = {
        trial: i + 1,
        successes,
        runningAverage,
        isConverged,
      };

      simResults.push(result);
      setCurrentSimulation(i + 1);

      // UI 업데이트를 위한 지연 (매 100번째마다)
      if (i % 100 === 0) {
        setResults([...simResults]);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    // 최종 결과 설정
    setResults(simResults);

    // 통계 계산
    const successes = simResults.map((r) => r.successes);
    const finalAverage = runningSum / simulationCount;
    const variance =
      successes.reduce((sum, val) => sum + Math.pow(val - finalAverage, 2), 0) /
      simulationCount;
    const standardDeviation = Math.sqrt(variance);
    const theoretical = simulateTrials(trials, p, simulationCount);

    setFinalStats({
      average: finalAverage,
      variance,
      standardDeviation,
      theoretical,
      convergenceRate:
        simResults.filter((r) => r.isConverged).length / simulationCount,
    });

    setIsRunning(false);
  }, [probability, trials, simulationCount, isPaused]);

  // 시뮬레이션 일시정지/재개
  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // 시뮬레이션 초기화
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSimulation(0);
    setResults([]);
    setFinalStats(null);
  }, []);

  // 결과 내보내기
  const exportResults = useCallback(() => {
    if (results.length === 0) return;

    const csvContent = [
      "Trial,Successes,Running Average,Converged",
      ...results.map(
        (r) =>
          `${r.trial},${r.successes},${r.runningAverage.toFixed(4)},${
            r.isConverged
          }`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulation_${probability}%_${trials}trials_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, probability, trials]);

  // 실시간 차트 데이터
  const chartData = useMemo(() => {
    if (results.length === 0) return [];

    // 매 50번째 결과만 표시 (성능 최적화)
    return results.filter(
      (_, index) => index % Math.max(1, Math.floor(results.length / 100)) === 0
    );
  }, [results]);

  const expectedValue = (probability / 100) * trials;

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>몬테카르로 시뮬레이션</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/30">
            <TabsTrigger value="setup" className="text-slate-300">
              설정
            </TabsTrigger>
            <TabsTrigger value="results" className="text-slate-300">
              결과
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-slate-300">
              분석
            </TabsTrigger>
          </TabsList>

          {/* 설정 탭 */}
          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sim-count" className="text-slate-300">
                  시뮬레이션 횟수
                </Label>
                <Input
                  id="sim-count"
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={simulationCount}
                  onChange={(e) => setSimulationCount(Number(e.target.value))}
                  className="bg-slate-900/50 border-slate-600/50 text-slate-200"
                  disabled={isRunning}
                />
                <p className="text-xs text-slate-500">
                  더 많은 시뮬레이션일수록 정확하지만 시간이 오래 걸립니다
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">현재 설정</Label>
                <div className="p-3 bg-slate-900/30 rounded space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">성공 확률:</span>
                    <span className="text-slate-200">{probability}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">시행 횟수:</span>
                    <span className="text-slate-200">{trials}회</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">이론적 기댓값:</span>
                    <span className="text-blue-400">
                      {expectedValue.toFixed(2)}회
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={runSimulation}
                disabled={isRunning || probability <= 0 || trials <= 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Play size={16} className="mr-2" />
                시뮬레이션 시작
              </Button>

              {isRunning && (
                <Button
                  onClick={togglePause}
                  variant="outline"
                  className="bg-slate-700/30 border-slate-600/50 text-slate-300"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </Button>
              )}

              <Button
                onClick={resetSimulation}
                variant="outline"
                className="bg-slate-700/30 border-slate-600/50 text-slate-300"
              >
                <RotateCcw size={16} />
              </Button>
            </div>

            {/* 진행 상황 */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">진행 상황</span>
                  <span className="text-slate-300">
                    {currentSimulation} / {simulationCount}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentSimulation / simulationCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* 결과 탭 */}
          <TabsContent value="results" className="space-y-4">
            {results.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>시뮬레이션을 실행하면 결과가 표시됩니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 실시간 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardContent className="p-4 text-center">
                      <Timer className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        완료된 시뮬레이션
                      </p>
                      <p className="text-xl font-bold text-blue-400">
                        {currentSimulation}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardContent className="p-4 text-center">
                      <Target className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">현재 평균</p>
                      <p className="text-xl font-bold text-green-400">
                        {results.length > 0
                          ? results[results.length - 1].runningAverage.toFixed(
                              2
                            )
                          : "0"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">이론값과 차이</p>
                      <p className="text-xl font-bold text-purple-400">
                        {results.length > 0
                          ? Math.abs(
                              results[results.length - 1].runningAverage -
                                expectedValue
                            ).toFixed(2)
                          : "0"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardContent className="p-4 text-center">
                      <Badge className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">수렴 여부</p>
                      <p className="text-xl font-bold text-yellow-400">
                        {results.length > 0 &&
                        results[results.length - 1].isConverged
                          ? "✓"
                          : "✗"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 간단한 선 차트 (CSS만으로) */}
                <Card className="bg-slate-900/30 border-slate-700/30">
                  <CardHeader>
                    <CardTitle className="text-slate-200 text-lg">
                      수렴 과정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 relative bg-slate-800/50 rounded p-4">
                      <div className="absolute inset-4 border-l border-b border-slate-600"></div>

                      {/* 이론값 기준선 */}
                      <div
                        className="absolute left-4 right-4 border-t border-dashed border-blue-400 opacity-50"
                        style={{
                          top: `${
                            16 +
                            (1 - expectedValue / (trials * 1.2)) * (160 - 32)
                          }px`,
                        }}
                      />

                      {/* 데이터 포인트들 */}
                      <div className="absolute inset-4">
                        {chartData.map((result, index) => {
                          const x = (index / (chartData.length - 1)) * 100;
                          const y =
                            (1 - result.runningAverage / (trials * 1.2)) * 100;
                          return (
                            <div
                              key={result.trial}
                              className={`absolute w-1 h-1 rounded-full ${
                                result.isConverged
                                  ? "bg-green-400"
                                  : "bg-orange-400"
                              }`}
                              style={{
                                left: `${x}%`,
                                top: `${Math.max(0, Math.min(100, y))}%`,
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="absolute bottom-1 left-4 text-xs text-slate-500">
                        0
                      </div>
                      <div className="absolute bottom-1 right-4 text-xs text-slate-500">
                        {simulationCount}
                      </div>
                      <div className="absolute top-1 left-1 text-xs text-slate-500">
                        {trials}
                      </div>
                      <div className="absolute bottom-1 left-1 text-xs text-slate-500">
                        0
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full opacity-50"></div>
                        <span className="text-slate-400">이론값</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-400">수렴됨</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-slate-400">수렴 중</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={exportResults}
                  variant="outline"
                  className="w-full bg-slate-700/30 border-slate-600/50 text-slate-300"
                >
                  <Download size={16} className="mr-2" />
                  결과 CSV로 내보내기
                </Button>
              </div>
            )}
          </TabsContent>

          {/* 분석 탭 */}
          <TabsContent value="analysis" className="space-y-4">
            {finalStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-slate-200 text-lg">
                        시뮬레이션 결과
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">평균값</span>
                        <span className="text-slate-200 font-mono">
                          {finalStats.average.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">분산</span>
                        <span className="text-slate-200 font-mono">
                          {finalStats.variance.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">표준편차</span>
                        <span className="text-slate-200 font-mono">
                          {finalStats.standardDeviation.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">수렴률</span>
                        <span className="text-green-400 font-mono">
                          {(finalStats.convergenceRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-slate-200 text-lg">
                        이론값 비교
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">이론 평균</span>
                        <span className="text-blue-400 font-mono">
                          {finalStats.theoretical.expectedValue.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">이론 분산</span>
                        <span className="text-blue-400 font-mono">
                          {finalStats.theoretical.variance.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">평균 오차</span>
                        <span className="text-orange-400 font-mono">
                          {Math.abs(
                            finalStats.average -
                              finalStats.theoretical.expectedValue
                          ).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">오차율</span>
                        <span className="text-orange-400 font-mono">
                          {(
                            (Math.abs(
                              finalStats.average -
                                finalStats.theoretical.expectedValue
                            ) /
                              finalStats.theoretical.expectedValue) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-900/30 border-slate-700/30">
                  <CardHeader>
                    <CardTitle className="text-slate-200 text-lg">
                      결론
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>
                        <strong className="text-green-400">
                          {simulationCount.toLocaleString()}
                        </strong>
                        번의 시뮬레이션 결과, 평균 성공 횟수는{" "}
                        <strong className="text-blue-400">
                          {finalStats.average.toFixed(2)}
                        </strong>
                        회였습니다.
                      </p>
                      <p>
                        이는 이론적 기댓값{" "}
                        <strong className="text-blue-400">
                          {expectedValue.toFixed(2)}
                        </strong>
                        회와
                        <strong className="text-orange-400">
                          {" "}
                          {Math.abs(finalStats.average - expectedValue).toFixed(
                            2
                          )}
                        </strong>
                        회 차이가 나며, 오차율은{" "}
                        <strong className="text-orange-400">
                          {(
                            (Math.abs(finalStats.average - expectedValue) /
                              expectedValue) *
                            100
                          ).toFixed(2)}
                          %
                        </strong>
                        입니다.
                      </p>
                      {finalStats.convergenceRate > 0.8 ? (
                        <p className="text-green-400">
                          ✓ 시뮬레이션이 이론값에 잘 수렴했습니다. (
                          {(finalStats.convergenceRate * 100).toFixed(1)}%의
                          시뮬레이션이 수렴)
                        </p>
                      ) : (
                        <p className="text-yellow-400">
                          ⚠ 더 많은 시뮬레이션이 필요할 수 있습니다. (
                          {(finalStats.convergenceRate * 100).toFixed(1)}%의
                          시뮬레이션이 수렴)
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>시뮬레이션 완료 후 분석 결과가 표시됩니다</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
