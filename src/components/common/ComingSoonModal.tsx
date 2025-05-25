import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Sparkles, Settings, Zap } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: "default" | "settings" | "feature";
  customFeatures?: string[];
  releaseDate?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title = "상세 정보",
  type = "default",
  customFeatures,
  releaseDate = "2025년 6월 2째주",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "settings":
        return <Settings className="w-5 h-5 text-blue-400" />;
      case "feature":
        return <Zap className="w-5 h-5 text-green-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "settings":
        return "설정";
      case "feature":
        return "새로운 기능";
      default:
        return title;
    }
  };

  const getFeatures = () => {
    if (customFeatures) return customFeatures;

    switch (type) {
      case "settings":
        return [
          "• 다크/라이트 테마 설정",
          "• 계산 히스토리",
          "• 개인화된 추천 설정",
        ];
      case "feature":
        return [
          "• 실시간 서버 정보",
          "• 길드 관리 도구",
          "• 아이템 가격 추적",
          "• 캐릭터 스탯 계산기",
          "• 퀘스트 진행도 추적",
        ];
      default:
        return [
          "• 상세한 몬스터 정보",
          "• 드랍 아이템 상세 정보",
          "• 사냥터 사진 및 위치, 역할 설명",
        ];
    }
  };

  const getGradientColor = () => {
    switch (type) {
      case "settings":
        return "from-blue-500/10 to-cyan-500/10 border border-blue-500/20";
      case "feature":
        return "from-green-500/10 to-emerald-500/10 border border-green-500/20";
      default:
        return "from-purple-500/10 to-blue-500/10 border border-purple-500/20";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "settings":
        return "text-blue-400";
      case "feature":
        return "text-green-400";
      default:
        return "text-purple-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4 bg-slate-800/95 border-slate-700/50 backdrop-blur-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            {getIcon()}
            <span>{getTitle()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex items-start space-x-3 p-4 bg-gradient-to-r ${getGradientColor()} rounded-lg`}
          >
            <AlertCircle
              className={`w-5 h-5 ${getIconColor()} mt-0.5 flex-shrink-0`}
            />
            <div className="space-y-2">
              <h3
                className={`font-medium ${getIconColor()
                  .replace("text-", "text-")
                  .replace("-400", "-300")}`}
              >
                다음 업데이트 예정 기능
              </h3>
              <ul className="text-sm text-slate-300 space-y-1">
                {getFeatures().map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              예상 출시: {releaseDate}
            </span>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-black transition-colors duration-200"
          >
            확인
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonModal;
