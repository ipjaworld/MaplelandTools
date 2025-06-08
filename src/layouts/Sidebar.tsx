import React from "react";
// import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  // TrendingUp
} from "lucide-react";
import Navigation from "./Navigation";
import { cn } from "@/lib/utils";
// import { SIDEBAR_COMMON_PROBABILITIES } from '../constants/calculatorConstants';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  // const commonProbabilities = SIDEBAR_COMMON_PROBABILITIES;

  return (
    <>
      {/* Mobile Sidebar Overlay - 드로어가 열렸을 때만 표시 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer Sidebar - 항상 fixed 포지션으로 오버레이 */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 z-50", // 헤더 아래에서 시작, 항상 fixed
          "w-80 bg-slate-800/30 backdrop-blur-md",
          "border-r border-slate-700/50",
          "transform transition-transform duration-300 ease-in-out",
          "shadow-2xl", // 드로어 그림자 추가
          sidebarOpen ? "translate-x-0" : "-translate-x-full" // 상태에 따라 슬라이드
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Navigation - 모든 화면 크기에서 표시 */}
          <div className="p-4 border-b border-slate-700/50">
            <Navigation
              className="flex-col space-x-0 space-y-2"
              onItemClick={() => setSidebarOpen(false)}
            />
          </div>

          {/* Quick Probability Reference */}
          <div className="flex-1 p-4 space-y-4">
            {/* <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2 text-slate-200">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>자주 사용하는 확률</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonProbabilities.map((prob) => (
                  <div key={prob.value} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/20 hover:bg-slate-900/40 transition-all duration-200 cursor-pointer group">
                    <div className="space-y-1">
                      <Badge className={`${prob.color} text-xs font-medium group-hover:scale-105 transition-transform`}>
                        {prob.label}
                      </Badge>
                      <p className="text-xs text-slate-400">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card> */}

            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2 text-slate-200">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>계산 팁</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg hover:from-blue-500/15 hover:to-blue-600/10 transition-all duration-200">
                  <p className="font-medium text-blue-300 text-xs mb-1">
                    💡 독립시행이란?
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    각 시행이 서로 영향을 주지 않는 시행
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg hover:from-green-500/15 hover:to-green-600/10 transition-all duration-200">
                  <p className="font-medium text-green-300 text-xs mb-1">
                    📊 기댓값
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    확률 × 시행횟수 = 예상 성공 횟수
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg hover:from-purple-500/15 hover:to-purple-600/10 transition-all duration-200">
                  <p className="font-medium text-purple-300 text-xs mb-1">
                    🎯 누적 확률
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    X회 이하 성공할 확률의 합계
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer in Sidebar */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/20 mt-auto">
            <div className="text-xs text-slate-500 text-center space-y-1">
              <p className="font-medium text-slate-400">
                © 2025 메이플 계산기
              </p>
              <p>독립시행 확률 계산 도구</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
