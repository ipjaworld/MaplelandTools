import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  MapPin,
  History,
  Info,
  Smartphone,
  Monitor,
  AlertTriangle,
} from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isOptimized: boolean;
  comingSoon?: boolean;
  onNavigate: (path: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  path,
  isOptimized,
  comingSoon = false,
  onNavigate,
}) => {
  const handleClick = () => {
    if (!comingSoon) {
      onNavigate(path);
    }
  };

  return (
    <Card
      className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        comingSoon
          ? "bg-slate-800/40 border-slate-700/50 opacity-60 cursor-not-allowed"
          : isOptimized
            ? "bg-slate-800/40 border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/10 hover:border-cyan-400/60 hover:shadow-cyan-400/25"
            : "bg-slate-800/40 border-2 border-orange-400/30 shadow-lg shadow-orange-400/10 hover:border-orange-400/60 hover:shadow-orange-400/25"
      } backdrop-blur-sm overflow-hidden`}
      onClick={handleClick}
    >
      {/* 네온 글로우 효과 */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          comingSoon
            ? ""
            : isOptimized
              ? "bg-gradient-to-br from-cyan-400/5 to-blue-400/5"
              : "bg-gradient-to-br from-orange-400/5 to-red-400/5"
        }`}
      />

      {/* Coming Soon Overlay */}
      {comingSoon && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <Badge className="bg-slate-700/80 text-slate-300 border-slate-600">
            Coming Soon
          </Badge>
        </div>
      )}

      <CardContent className="relative z-0 p-6 h-full flex flex-col">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOptimized
                ? "bg-cyan-400/20 text-cyan-300"
                : "bg-orange-400/20 text-orange-300"
            }`}
          >
            {icon}
          </div>

          <div className="flex flex-col items-end space-y-1">
            {isOptimized ? (
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                모바일 최적화
              </Badge>
            ) : (
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                데스크톱 전용
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              {isOptimized ? (
                <>
                  <Smartphone className="w-3 h-3" />
                  <span>모바일 지원</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3 h-3" />
                  <span>데스크톱 전용</span>
                </>
              )}
            </div>
            <span
              className={`font-medium ${
                isOptimized ? "text-cyan-400" : "text-orange-400"
              }`}
            >
              {comingSoon ? "준비중" : "이용 가능"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MainPage: React.FC<{ onNavigate?: (path: string) => void }> = ({
  onNavigate = () => {},
}) => {
  const services = [
    {
      title: "주문서 확률 계산기",
      description:
        "독립시행 확률을 계산하여 주문서 성공 확률을 정확히 예측할 수 있습니다. 이항분포와 누적확률을 활용한 정교한 계산을 제공합니다.",
      icon: <Calculator className="w-6 h-6" />,
      path: "/calculator",
      isOptimized: true,
    },
    {
      title: "사냥터 가이드",
      description:
        "레벨과 직업에 맞는 최적의 사냥터를 추천해드립니다. 현재 궁수 직업군에 최적화되어 있으며, 실시간 데이터를 기반으로 합니다.",
      icon: <MapPin className="w-6 h-6" />,
      path: "/hunting-grounds",
      isOptimized: false,
    },
    {
      title: "계산 히스토리",
      description:
        "이전에 계산했던 확률들을 저장하고 관리할 수 있습니다. 자주 사용하는 계산을 즐겨찾기로 등록하여 빠르게 접근하세요.",
      icon: <History className="w-6 h-6" />,
      path: "/history",
      isOptimized: false,
    },
    {
      title: "서비스 정보",
      description:
        "메랜도구의 개발 배경과 사용법, 업데이트 소식을 확인할 수 있습니다. 피드백과 건의사항도 여기서 남겨주세요.",
      icon: <Info className="w-6 h-6" />,
      path: "/about",
      isOptimized: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              메랜도구
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              메이플랜드 플레이에 필요한 각종 계산과 정보를
              <span className="text-cyan-400 font-semibold"> 편리하게 </span>
              제공하는 도구 모음입니다
            </p>
          </div>

          {/* Status Banner */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-medium">베타 서비스</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-600"></div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>모바일 최적화: 주문서 계산기</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-1">
                <Monitor className="w-4 h-4 text-orange-400" />
                <span>Chrome 브라우저 권장</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              path={service.path}
              isOptimized={service.isOptimized}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4 pt-8 border-t border-slate-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                <span className="text-slate-300 font-medium">
                  모바일 최적화 완료
                </span>
              </div>
              <p className="text-slate-500 text-xs">터치 인터페이스 지원</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                <span className="text-slate-300 font-medium">
                  데스크톱 전용
                </span>
              </div>
              <p className="text-slate-500 text-xs">모바일 최적화 예정</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                <span className="text-slate-300 font-medium">
                  지속 업데이트
                </span>
              </div>
              <p className="text-slate-500 text-xs">새로운 기능 추가 예정</p>
            </div>
          </div>

          <div className="pt-4 text-xs text-slate-500">
            <p>© 2025 메랜도구 • 메이플랜드 편의 도구 • Beta Version</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
