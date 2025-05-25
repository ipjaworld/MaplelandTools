// src/types/huntingTypes.ts - 완전히 새로운 타입 정의

export interface HuntingArea {
  areaName: string;
  levelRange: string;
  playStyle: string[];
  recommendedFor: string[];
  notes: string[];
  // 계산된 필드들
  minLevel: number;
  maxLevel: number;
  mapName: string;
  id: string;
}

export interface MapGuide {
  mapName: string;
  areas: {
    areaName: string;
    levelRange: string;
    playStyle: string[];
    recommendedFor: string[];
    notes: string[];
  }[];
}

export interface HuntingData {
  mapGuides: MapGuide[];
}

export interface HuntingFilters {
  searchTerm: string;
  selectedLevel: string;
  selectedJob: string;
  selectedMap: string;
  playStyleFilter: "all" | "solo" | "party" | "support";
  quickFilter: "all" | "beginner" | "party" | "farming";
}

// 메이플랜드 직업 목록 (데이터에서 추출)
export const MAPLELAND_JOBS = [
  "전사",
  "마법사",
  "궁수", 
  "도적",
  "법사",
  "썬콜",
  "용기사",
  "나이트",
  "저격수",
  "크루세이더",
] as const;

export type MapleJob = (typeof MAPLELAND_JOBS)[number];

// 플레이 스타일 매핑
export const PLAY_STYLE_COLORS = {
  solo: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  party: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  support: "bg-green-500/10 text-green-300 border-green-500/20",
} as const;

// 레벨 범위 파싱 함수
export const parseLevelRange = (levelRange: string): { min: number; max: number } => {
  // "8–13" 형태
  const dashMatch = levelRange.match(/(\d+)[–-](\d+)/);
  if (dashMatch) {
    return {
      min: parseInt(dashMatch[1]),
      max: parseInt(dashMatch[2])
    };
  }
  
  // "80+" 형태
  const plusMatch = levelRange.match(/(\d+)\+/);
  if (plusMatch) {
    const level = parseInt(plusMatch[1]);
    return {
      min: level,
      max: level + 20 // +는 20레벨 범위로 가정
    };
  }
  
  // 단일 숫자
  const singleMatch = levelRange.match(/(\d+)/);
  if (singleMatch) {
    const level = parseInt(singleMatch[1]);
    return {
      min: level,
      max: level + 5 // 기본 5레벨 범위
    };
  }
  
  return { min: 1, max: 200 }; // 기본값
};

// 데이터 변환 함수
export const transformHuntingData = (data: HuntingData): HuntingArea[] => {
  const result: HuntingArea[] = [];
  
  data.mapGuides.forEach(mapGuide => {
    mapGuide.areas.forEach(area => {
      const { min, max } = parseLevelRange(area.levelRange);
      
      result.push({
        ...area,
        minLevel: min,
        maxLevel: max,
        mapName: mapGuide.mapName,
        id: `${mapGuide.mapName}-${area.areaName}`.replace(/\s+/g, '-').toLowerCase()
      });
    });
  });
  
  return result;
};

// 필터링 함수
export const filterHuntingAreas = (areas: HuntingArea[], filters: HuntingFilters): HuntingArea[] => {
  return areas.filter(area => {
    // 검색어 필터
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        area.areaName.toLowerCase().includes(searchLower) ||
        area.mapName.toLowerCase().includes(searchLower) ||
        area.notes.some(note => note.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // 레벨 필터
    if (filters.selectedLevel) {
      const level = parseInt(filters.selectedLevel);
      if (level < area.minLevel || level > area.maxLevel) {
        return false;
      }
    }

    // 직업 필터
    if (filters.selectedJob) {
      const jobMatch = 
        area.recommendedFor.includes(filters.selectedJob) ||
        area.recommendedFor.includes("all jobs") ||
        area.recommendedFor.some(job => job.includes("all jobs"));
      
      if (!jobMatch) return false;
    }

    // 맵 필터
    if (filters.selectedMap && area.mapName !== filters.selectedMap) {
      return false;
    }

    // 플레이 스타일 필터
    if (filters.playStyleFilter !== "all") {
      if (!area.playStyle.includes(filters.playStyleFilter)) {
        return false;
      }
    }

    // 빠른 필터
    if (filters.quickFilter !== "all") {
      switch (filters.quickFilter) {
        case "beginner":
          if (area.maxLevel > 30) return false;
          break;
        case "party":
          if (!area.playStyle.includes("party")) return false;
          break;
        case "farming":
          if (!area.notes.some(note => 
            note.includes("파밍") || 
            note.includes("돈벌이") || 
            note.includes("드랍")
          )) return false;
          break;
      }
    }

    return true;
  });
};

// 레벨 기반 추천 함수
export const getRecommendationsForLevel = (areas: HuntingArea[], level: number): HuntingArea[] => {
  return areas
    .filter(area => level >= area.minLevel && level <= area.maxLevel)
    .sort((a, b) => {
      // 레벨 중심점과의 거리로 정렬
      const aCenter = (a.minLevel + a.maxLevel) / 2;
      const bCenter = (b.minLevel + b.maxLevel) / 2;
      return Math.abs(level - aCenter) - Math.abs(level - bCenter);
    })
    .slice(0, 5);
};

// 통계 계산 함수
export const calculateStatistics = (areas: HuntingArea[]) => {
  const byPlayStyle = areas.reduce((acc, area) => {
    area.playStyle.forEach(style => {
      acc[style] = (acc[style] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const levelRanges = {
    beginner: areas.filter(area => area.maxLevel <= 30).length,
    intermediate: areas.filter(area => area.minLevel > 30 && area.maxLevel <= 70).length,
    advanced: areas.filter(area => area.minLevel > 70).length
  };

  const maps = Array.from(new Set(areas.map(area => area.mapName)));

  return {
    total: areas.length,
    byPlayStyle,
    levelRanges,
    maps: maps.length
  };
};