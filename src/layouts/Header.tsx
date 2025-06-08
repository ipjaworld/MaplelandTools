import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ComingSoonModal from "@/components/common/ComingSoonModal";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-700/50 bg-slate-800/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* 햄버거/닫기 버튼 - 모바일 퍼스트 */}
            <Button
              variant="ghost"
              size="sm"
              className={`transition-all duration-200 h-10 w-10 p-0 rounded-lg flex-shrink-0 ${
                sidebarOpen
                  ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200"
                  : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/60"
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo - 모바일 퍼스트 반응형 */}
            <div className="flex items-center space-x-2 md:gap-4 md:space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-3">
                <h1 className="text-[24px] font-bold text-slate-200">
                  메랜도구
                </h1>
                {/* 모바일에서는 숨김, 태블릿에서는 축약, 데스크톱에서는 전체 */}
                <p className="hidden md:block lg:hidden text-xs text-slate-400 leading-tight">
                  메이플랜드 편의 도구
                </p>
                <p className="hidden lg:block text-sm text-slate-400 leading-tight">
                  주문서 확률 계산, 사냥터 추천 등 자주 나오는 질문, 자주
                  계산해보는 내용을 편리하게
                </p>
              </div>
            </div>
          </div>

          {/* Right side - 모바일 퍼스트 */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettingsModal(true)}
              className="bg-slate-700/40 border-slate-600/50 text-slate-300 hover:bg-slate-600/60 hover:text-slate-100 hover:border-slate-500/60 transition-all duration-200 text-xs md:text-sm px-2 md:px-3"
            >
              {/* 모바일에서는 이모지, 데스크톱에서는 텍스트 */}
              <span className="md:hidden">⚙️</span>
              <span className="hidden md:inline">설정</span>
            </Button>
          </div>
        </div>

        {/* 드로어 상태 표시 바 */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
            sidebarOpen ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </header>

      {/* Settings Modal */}
      <ComingSoonModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        type="settings"
        releaseDate="2025년 6월 2째주"
      />
    </>
  );
};

export default Header;
