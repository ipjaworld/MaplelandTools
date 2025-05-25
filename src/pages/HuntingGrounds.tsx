import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Users,
  User,
  Search,
  Filter,
  Target,
  Lightbulb,
  Sword,
  Shield,
  Users2,
  Crown,
} from "lucide-react";
import { useFilteredHuntingData } from "../hooks/useHuntingData";
import { MAPLELAND_JOBS, PLAY_STYLE_COLORS } from "../types/huntingTypes";
import ComingSoonModal from "@/components/common/ComingSoonModal";

const HuntingGrounds: React.FC = () => {
  const {
    filteredAreas,
    availableMaps,
    statistics,
    recommendations,
    filters,
    updateFilter,
    resetFilters,
    isOptimalForLevel,
    totalCount,
    filteredCount,
  } = useFilteredHuntingData();

  const [showDetailModal, setShowDetailModal] = useState(false);

  const getPlayStyleIcon = (playStyle: string) => {
    switch (playStyle) {
      case "solo":
        return <User className="w-3 h-3 text-blue-400" />;
      case "party":
        return <Users className="w-3 h-3 text-purple-400" />;
      case "support":
        return <Shield className="w-3 h-3 text-green-400" />;
      default:
        return <Target className="w-3 h-3 text-gray-400" />;
    }
  };

  const getPlayStyleColor = (playStyle: string) => {
    return (
      PLAY_STYLE_COLORS[playStyle as keyof typeof PLAY_STYLE_COLORS] ||
      "bg-gray-500/10 text-gray-300 border-gray-500/20"
    );
  };

  const formatJobRecommendation = (jobs: string[]) => {
    return jobs.map((job) => {
      if (job === "all jobs") return "모든 직업";
      if (job.includes("all jobs except")) {
        return job.replace("all jobs except", "제외:");
      }
      return job;
    });
  };

  const isPartyQuest = (area: any) => {
    return area.notes.some(
      (note: string) =>
        note.includes("파티퀘") ||
        note.includes("파퀘") ||
        note.includes("파티퀘스트")
    );
  };

  const isFarmingArea = (area: any) => {
    return area.notes.some(
      (note: string) =>
        note.includes("파밍") ||
        note.includes("돈벌이") ||
        note.includes("드랍")
    );
  };

  const selectedLevel = filters.selectedLevel
    ? parseInt(filters.selectedLevel)
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <MapPin className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center space-x-3">
              <span>메이플랜드 사냥터 가이드</span>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-sm font-medium">
                Beta
              </Badge>
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            레벨과 직업에 맞는 최적의 사냥터를 찾아보세요
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-blue-300 text-sm">🏹</span>
            <span className="text-blue-300 text-sm font-medium">
              현재 궁수 직업군에 최적화되어 있습니다
            </span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <span>총 {totalCount}개 사냥터</span>
            <span>•</span>
            <span>{statistics.maps}개 지역</span>
            <span>•</span>
            <span>실시간 데이터</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">솔로 사냥터</p>
                  <p className="text-xl font-bold text-slate-200">
                    {statistics.byPlayStyle.solo || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">파티 사냥터</p>
                  <p className="text-xl font-bold text-slate-200">
                    {statistics.byPlayStyle.party || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">초급 (1-30)</p>
                  <p className="text-xl font-bold text-slate-200">
                    {statistics.levelRanges.beginner}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Sword className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">고급 (70+)</p>
                  <p className="text-xl font-bold text-slate-200">
                    {statistics.levelRanges.advanced}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200">
              <Filter className="w-5 h-5 text-blue-400" />
              <span>필터 설정</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-slate-300">
                  검색
                </Label>
                <Input
                  id="search"
                  placeholder="사냥터명/지역/메모..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter("searchTerm", e.target.value)}
                  className="bg-slate-900/50 border-slate-600/50 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-slate-300">
                  내 레벨
                </Label>
                <Input
                  id="level"
                  type="number"
                  placeholder="예: 50"
                  value={filters.selectedLevel}
                  onChange={(e) =>
                    updateFilter("selectedLevel", e.target.value)
                  }
                  className="bg-slate-900/50 border-slate-600/50 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">직업</Label>
                <Select
                  value={filters.selectedJob}
                  onValueChange={(value) => updateFilter("selectedJob", value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="전체 직업" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-200">
                      전체 직업
                    </SelectItem>
                    {MAPLELAND_JOBS.map((job) => (
                      <SelectItem
                        key={job}
                        value={job}
                        className="text-slate-200"
                      >
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">지역</Label>
                <Select
                  value={filters.selectedMap}
                  onValueChange={(value) => updateFilter("selectedMap", value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="전체 지역" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-200">
                      전체 지역
                    </SelectItem>
                    {availableMaps.map((mapName) => (
                      <SelectItem
                        key={mapName}
                        value={mapName}
                        className="text-slate-200"
                      >
                        {mapName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">플레이 스타일</Label>
                <Select
                  value={filters.playStyleFilter}
                  onValueChange={(value) =>
                    updateFilter("playStyleFilter", value as any)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="solo">솔로</SelectItem>
                    <SelectItem value="party">파티</SelectItem>
                    <SelectItem value="support">서포트</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Label className="text-slate-300 w-full mb-2">빠른 필터</Label>
              {[
                { key: "all", label: "전체", icon: null },
                {
                  key: "beginner",
                  label: "초보자용",
                  icon: <Shield className="w-3 h-3" />,
                },
                {
                  key: "party",
                  label: "파티 전용",
                  icon: <Users className="w-3 h-3" />,
                },
                {
                  key: "farming",
                  label: "파밍",
                  icon: <Crown className="w-3 h-3" />,
                },
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={
                    filters.quickFilter === option.key ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => updateFilter("quickFilter", option.key as any)}
                  className={`transition-all duration-200 ${
                    filters.quickFilter === option.key
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border-blue-500"
                      : "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </Button>
              ))}
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-slate-200 transition-all duration-200"
              >
                필터 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Level Recommendations */}
        {recommendations.length > 0 && (
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Target className="w-5 h-5 text-yellow-400" />
                <span>레벨 {filters.selectedLevel} 추천 사냥터</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recommendations.map((area) => (
                  <Badge
                    key={area.id}
                    className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                  >
                    {area.mapName} - {area.areaName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">
              사냥터 목록 ({filteredCount}개 / 총 {totalCount}개)
            </h2>
          </div>

          {filteredCount === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-700/30 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-lg">
                  검색 조건에 맞는 사냥터가 없습니다
                </p>
                <p className="text-slate-500 text-sm">
                  다른 조건으로 검색해보세요
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAreas.map((area) => {
                const isOptimal = selectedLevel
                  ? isOptimalForLevel(area, selectedLevel)
                  : false;
                const isInRange = selectedLevel
                  ? selectedLevel >= area.minLevel &&
                    selectedLevel <= area.maxLevel
                  : false;

                return (
                  <Card
                    key={area.id}
                    className={`bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:border-slate-600/50 ${
                      isOptimal
                        ? "ring-2 ring-yellow-500/50 bg-yellow-500/5"
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-slate-200 flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <span>{area.areaName}</span>
                            {isOptimal && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                최적
                              </Badge>
                            )}
                            {isPartyQuest(area) && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                파퀘
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <span>{area.mapName}</span>
                            <span>•</span>
                            <span>레벨 {area.levelRange}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Play Styles */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                          <Users2 className="w-4 h-4 text-blue-400" />
                          <span>플레이 스타일</span>
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {area.playStyle.map((style, index) => (
                            <Badge
                              key={index}
                              className={getPlayStyleColor(style)}
                            >
                              <div className="flex items-center space-x-1">
                                {getPlayStyleIcon(style)}
                                <span>
                                  {style === "solo"
                                    ? "솔로"
                                    : style === "party"
                                    ? "파티"
                                    : style === "support"
                                    ? "서포트"
                                    : style}
                                </span>
                              </div>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Job Recommendations */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                          <Sword className="w-4 h-4 text-purple-400" />
                          <span>추천 직업</span>
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {formatJobRecommendation(area.recommendedFor)
                            .slice(0, 4)
                            .map((job, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20"
                              >
                                {job}
                              </Badge>
                            ))}
                          {area.recommendedFor.length > 4 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-slate-700/50 text-slate-400"
                            >
                              +{area.recommendedFor.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Notes/Tips */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                          <span>사냥 정보</span>
                        </h4>
                        <ul className="space-y-1">
                          {area.notes.map((note, index) => (
                            <li
                              key={index}
                              className="text-xs text-slate-400 flex items-start space-x-2"
                            >
                              <span className="text-yellow-400 mt-0.5">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Level Match Indicator */}
                      {selectedLevel && (
                        <div
                          className={`p-2 rounded-lg border ${
                            isOptimal
                              ? "bg-green-500/10 border-green-500/20"
                              : isInRange
                              ? "bg-blue-500/10 border-blue-500/20"
                              : "bg-red-500/10 border-red-500/20"
                          }`}
                        >
                          <div className="flex items-center space-x-2 text-xs">
                            <Target
                              className={`w-3 h-3 ${
                                isOptimal
                                  ? "text-green-400"
                                  : isInRange
                                  ? "text-blue-400"
                                  : "text-red-400"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                isOptimal
                                  ? "text-green-300"
                                  : isInRange
                                  ? "text-blue-300"
                                  : "text-red-300"
                              }`}
                            >
                              {isOptimal
                                ? "최적 레벨 매치"
                                : isInRange
                                ? "레벨 적합"
                                : "레벨 부적합"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Special Tags */}
                      <div className="flex flex-wrap gap-1">
                        {isFarmingArea(area) && (
                          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
                            파밍터
                          </Badge>
                        )}
                        {area.maxLevel <= 30 && (
                          <Badge className="bg-green-500/10 text-green-300 border-green-500/20 text-xs">
                            초보자 추천
                          </Badge>
                        )}
                        {area.minLevel >= 70 && (
                          <Badge className="bg-red-500/10 text-red-300 border-red-500/20 text-xs">
                            고레벨
                          </Badge>
                        )}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-green-600/80 to-blue-600/80 hover:from-green-600 hover:to-blue-600 text-white hover:text-white transition-all duration-200"
                        variant="outline"
                        onClick={() => setShowDetailModal(true)}
                      >
                        상세 정보 보기
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <ComingSoonModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="상세 정보"
        type="default"
        releaseDate="2025년 6월 2째주"
      />
    </div>
  );
};

export default HuntingGrounds;
