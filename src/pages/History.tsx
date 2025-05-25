import React from 'react';
import { useCalculator } from '../contexts/CalculatorContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, Trash2, Clock, TrendingUp, Target, RotateCcw } from 'lucide-react';

const History: React.FC = () => {
  const { state, clearHistory } = useCalculator();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProbabilityColor = (probability: number) => {
    if (probability <= 0.15) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (probability <= 0.3) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (probability <= 0.6) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <HistoryIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              계산 히스토리
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            이전에 계산했던 결과들을 확인하고 비교해보세요
          </p>
        </div>

        {/* Controls */}
        {state.history.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={clearHistory}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50"
            >
              <Trash2 size={16} className="mr-2" />
              전체 삭제
            </Button>
          </div>
        )}

        {/* History List */}
        {state.history.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 mx-auto bg-slate-800/30 rounded-full flex items-center justify-center">
              <HistoryIcon className="w-10 h-10 text-slate-500" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-xl">아직 계산 히스토리가 없습니다</p>
              <p className="text-slate-500">계산기에서 확률을 계산해보세요</p>
            </div>
            <Button
              onClick={() => window.location.href = '/calculator'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              계산기로 이동
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-slate-300">
              총 <span className="text-purple-400 font-semibold">{state.history.length}</span>개의 계산 기록
            </div>
            
            <div className="grid gap-4">
              {state.history.map((item, index) => (
                <Card key={item.id} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-slate-400 text-sm">#{state.history.length - index}</span>
                        </div>
                        <Badge className={getProbabilityColor(item.probability)}>
                          {(item.probability * 100).toFixed(1)}%
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {item.trials}회 시행
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* 기댓값 */}
                      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            <p className="text-blue-300 text-sm font-medium">기댓값</p>
                          </div>
                          <p className="text-xl font-bold text-blue-400">
                            {(item.probability * item.trials).toFixed(1)}회
                          </p>
                        </CardContent>
                      </Card>

                      {/* 1회 이상 성공 확률 */}
                      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <p className="text-green-300 text-sm font-medium">1회 이상</p>
                          </div>
                          <p className="text-xl font-bold text-green-400">
                            {((1 - item.results[0].probability) * 100).toFixed(1)}%
                          </p>
                        </CardContent>
                      </Card>

                      {/* 최고 확률 */}
                      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                            <p className="text-amber-300 text-sm font-medium">최고 확률</p>
                          </div>
                          <p className="text-xl font-bold text-amber-400">
                            {(() => {
                              const maxResult = item.results.reduce((max, current) => 
                                current.probability > max.probability ? current : max
                              );
                              return `${maxResult.successCount}회`;
                            })()}
                          </p>
                        </CardContent>
                      </Card>

                      {/* 계산 시간 */}
                      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <p className="text-purple-300 text-sm font-medium">계산 시간</p>
                          </div>
                          <p className="text-xl font-bold text-purple-400">
                            {formatDate(item.timestamp)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 상세 결과 미리보기 */}
                    <div className="mt-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">확률 분포 미리보기</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        {item.results.slice(0, 5).map((result) => (
                          <div key={result.successCount} className="text-center space-y-1">
                            <div className="text-slate-400">{result.successCount}회</div>
                            <div className="text-slate-300 font-medium">
                              {(result.probability * 100).toFixed(2)}%
                            </div>
                          </div>
                        ))}
                        {item.results.length > 5 && (
                          <div className="text-center space-y-1 text-slate-500">
                            <div>...</div>
                            <div className="text-xs">+{item.results.length - 5}개</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        다시 계산하기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30"
                      >
                        상세 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;