import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Info,
  // Github,
  Mail,
  Star,
  Calculator,
  MapPin,
  Palette,
  Smartphone,
  // Zap,
  // Users,
  BookOpen,
  Heart,
} from "lucide-react";

const About: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: "정확한 확률 계산",
      description:
        "이항분포를 기반으로 한 수학적으로 정확한 독립시행 확률 계산",
      color: "text-blue-400",
    },
    {
      icon: MapPin,
      title: "사냥터 추천 시스템",
      description: "레벨과 직업에 맞는 개인화된 사냥터, 파티퀘스트, 보스 추천",
      color: "text-green-400",
    },
    {
      icon: Palette,
      title: "모던 UI/UX",
      description: "Shadcn/ui 기반의 세련된 다크 테마와 직관적인 사용자 경험",
      color: "text-purple-400",
    },
    {
      icon: Smartphone,
      title: "반응형 디자인",
      description: "데스크톱부터 모바일까지 모든 기기에서 최적화된 레이아웃",
      color: "text-orange-400",
    },
    // {
    //   icon: Zap,
    //   title: '빠른 성능',
    //   description: 'React 19과 TypeScript로 구축된 빠르고 안정적인 웹 애플리케이션',
    //   color: 'text-yellow-400'
    // },
    // {
    //   icon: Users,
    //   title: '커뮤니티 지향',
    //   description: '메이플스토리 커뮤니티의 피드백을 반영한 실용적인 기능들',
    //   color: 'text-pink-400'
    // }
  ];

  const techStack = [
    {
      name: "React 19",
      category: "Frontend",
      color: "bg-cyan-500/20 text-cyan-400",
    },
    {
      name: "TypeScript",
      category: "Language",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Tailwind CSS",
      category: "Styling",
      color: "bg-teal-500/20 text-teal-400",
    },
    {
      name: "Shadcn/ui",
      category: "Components",
      color: "bg-slate-500/20 text-slate-400",
    },
    {
      name: "Vite",
      category: "Build Tool",
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      name: "React Router",
      category: "Routing",
      color: "bg-red-500/20 text-red-400",
    },
  ];

  const usageSteps = [
    {
      step: 1,
      title: "확률 입력",
      description: "성공 확률을 퍼센트로 입력하거나 프리셋 버튼을 사용하세요",
      icon: "🎯",
    },
    {
      step: 2,
      title: "시행 횟수 설정",
      description: "원하는 시행 횟수를 입력하세요 (최대 1000회)",
      icon: "🔢",
    },
    {
      step: 3,
      title: "계산 실행",
      description: "계산하기 버튼을 클릭하여 결과를 확인하세요",
      icon: "⚡",
    },
    {
      step: 4,
      title: "결과 분석",
      description: "각 성공 횟수별 확률과 누적 확률을 분석해보세요",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <Info className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              프로젝트 정보
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            메이플스토리 플레이어를 위한 독립시행 확률 계산기와 사냥터 추천
            시스템입니다
          </p>
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About the Project */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span>이 프로젝트는?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                메이플스토리의 주문서, 스타포스 강화, 큐브 등급업 등{" "}
                <strong className="text-blue-400">독립시행 확률</strong>을
                정확히 계산하는 도구입니다.
              </p>
              <p className="text-slate-300 leading-relaxed">
                이항분포 수학 모델을 기반으로 각 시행의 성공 확률과 누적 확률을
                계산하여, 게임 내 확률 시스템을{" "}
                <strong className="text-green-400">과학적으로 분석</strong>할 수
                있도록 도와줍니다.
              </p>
              <p className="text-slate-300 leading-relaxed">
                또한 레벨과 직업에 맞는{" "}
                <strong className="text-purple-400">사냥터 추천 시스템</strong>
                을 통해 효율적인 레벨업 경로를 제안합니다.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>핵심 기능</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-slate-900/30 rounded-lg"
                  >
                    <feature.icon
                      className={`w-5 h-5 ${feature.color} mt-0.5 flex-shrink-0`}
                    />
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Features Grid */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 text-center">
              전체 기능 살펴보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 bg-slate-900/20 rounded-lg border border-slate-700/30 hover:bg-slate-900/40 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="text-slate-200 font-medium">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200">사용 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {usageSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="text-center space-y-4 p-4 bg-slate-900/20 rounded-lg border border-slate-700/30">
                    <div className="text-3xl">{step.icon}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {step.step}
                        </Badge>
                        <h3 className="text-slate-200 font-medium">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {step.step < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-slate-600 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200">기술 스택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 p-3 bg-slate-900/20 rounded-lg border border-slate-700/30"
                >
                  <Badge className={`${tech.color} text-xs font-medium`}>
                    {tech.name}
                  </Badge>
                  <p className="text-slate-500 text-xs">{tech.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200">연락처</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <Button 
                variant="outline" 
                className="w-full justify-start bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30"
              >
                <Github className="w-4 h-4 mr-3" />
                GitHub 저장소
              </Button> */}
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/30"
              >
                <Mail className="w-4 h-4 mr-3" />
                this_is_laugh@naver.com
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Heart className="w-5 h-5 text-red-400" />
                <span>기여하기</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300 text-sm">
              <p>
                이 프로젝트는 메이플스토리 월즈 / 메이플랜드를 이용하는 유저들을
                위해 제작된 비영리 프로젝트입니다.
              </p>
              <div className="space-y-2">
                <p>• 🐛 버그 리포트</p>
                <p>• 💡 기능 제안</p>
                <p>• 📝 문서 개선</p>
                <p>• 🔧 코드 기여</p>
              </div>
              <p className="text-slate-400 text-xs mt-4">
                여러분의 피드백과 기여가 프로젝트를 더욱 발전시킵니다!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700/50">
          <p className="text-slate-500 text-sm">
            © 2025 메이플 독립시행 계산기 •
            <span className="text-slate-400 ml-1">
              Made with ❤️ for MapleStory Community
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
