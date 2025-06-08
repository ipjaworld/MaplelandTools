// src/hooks/useHuntingData.ts - 완전히 새로운 데이터 훅

import { useState, useMemo, useCallback } from "react";
import type {
  HuntingData,
  HuntingArea,
  HuntingFilters,
  //   transformHuntingData,
  //   filterHuntingAreas,
  //   getRecommendationsForLevel,
  //   calculateStatistics,
} from "@/types/huntingTypes";
import {
  transformHuntingData as transform,
  filterHuntingAreas as filter,
  getRecommendationsForLevel as getRecommendations,
  calculateStatistics as calcStats,
} from "@/types/huntingTypes";

// 실제 메이플랜드 사냥터 데이터
const HUNTING_DATA: HuntingData = {
  mapGuides: [
    {
      mapName: "헤네시스",
      areas: [
        {
          areaName: "사냥터1",
          levelRange: "8–13",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: [
            "초반부 레벨링용",
            "기본기 연습에 최적화",
            "주문서 드랍 희귀",
          ],
        },
        {
          areaName: "동쪽풀숲",
          levelRange: "12–17",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "마법사", "도적"],
          notes: ["일자 지형으로 사냥 편리", "전사 비추천", "주문서 드랍 희귀"],
        },
        {
          areaName: "월묘의 떡",
          levelRange: "15–20",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["입문용 파티퀘스트", "공략 확인 필수"],
        },
        {
          areaName: "월묘의 떡 돼지 파티",
          levelRange: "20–25",
          playStyle: ["party"],
          recommendedFor: ["all jobs except 전사, 궁수"],
          notes: ["장비템 드랍 효율 높음", "전사·궁수 비선호"],
        },
      ],
    },
    {
      mapName: "엘리니아",
      areas: [
        {
          areaName: "북쪽필드",
          levelRange: "8–13",
          playStyle: ["solo"],
          recommendedFor: ["all jobs"],
          notes: ["초반 퀘스트 연계 사냥 적합", "스텀프·슬라임 출현"],
        },
        {
          areaName: "남쪽숲 나무던전 1",
          levelRange: "8–13",
          playStyle: ["solo"],
          recommendedFor: ["all jobs"],
          notes: ["느긋한 사냥 환경", "슬라임 방울 판매 수익 가능"],
        },
      ],
    },
    {
      mapName: "커닝시티",
      areas: [
        {
          areaName: "추락주의",
          levelRange: "17–25",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["노란 발판 안전 사냥", "옥토퍼스·파랑버섯 드랍 주문서 희귀"],
        },
        {
          areaName: "첫 번째 동행",
          levelRange: "21–30",
          playStyle: ["party"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["전사 비선호(명중 어려움)", "파퀘 공략 확인 권장"],
        },
      ],
    },
    {
      mapName: "상해 북부평원",
      areas: [
        {
          areaName: "상해 북부평원",
          levelRange: "25–32",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["몬스터 빼곡 출현", "솔플 효율 더 좋음"],
        },
      ],
    },
    {
      mapName: "페리온",
      areas: [
        {
          areaName: "암석지대 (와일드보어의 땅 2)",
          levelRange: "25–35",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["맵 좁음", "와일드보어 장비 파밍"],
        },
        {
          areaName: "유적 발굴지 3",
          levelRange: "25–30",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["좁은 맵·빽빽한 젠", "주문서 드랍 희귀"],
        },
        {
          areaName: "제1 군영",
          levelRange: "65–75",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["좁은 맵", "가치 있는 주문서 파밍"],
        },
      ],
    },
    {
      mapName: "슬리피우드",
      areas: [
        {
          areaName: "개미굴 1",
          levelRange: "21–31",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["파티 사냥 최적", "솔플 비효율"],
        },
        {
          areaName: "깊은 개미굴 2",
          levelRange: "25–35",
          playStyle: ["solo"],
          recommendedFor: ["전사"],
          notes: ["전사 전용 사냥터", "1층 낙하 사냥 효율적"],
        },
        {
          areaName: "골렘의 숲",
          levelRange: "60–80",
          playStyle: ["solo", "party"],
          recommendedFor: ["전사", "썬콜"],
          notes: ["좁은 맵·층 구조", "파밍·돈벌이 사냥터"],
        },
      ],
    },
    {
      mapName: "오르비스",
      areas: [
        {
          areaName: "탑 20층",
          levelRange: "21–25",
          playStyle: ["solo"],
          recommendedFor: ["all jobs"],
          notes: ["잡템 파밍용", "소규모 파티 가능"],
        },
        {
          areaName: "구름공원 2",
          levelRange: "35–40",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["무난한 사냥터", "별조각 파밍"],
        },
        {
          areaName: "산책로 1",
          levelRange: "40–50",
          playStyle: ["solo", "party"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["네펜데스 씨앗 파밍", "돈벌이 사냥터"],
        },
        {
          areaName: "구름공원 4",
          levelRange: "50–60",
          playStyle: ["solo", "party"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["루나픽시 다수 출현", "별조각 파밍"],
        },
        {
          areaName: "구름공원 6",
          levelRange: "80+",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["돈 앵벌이용 (경험치 비추천)"],
        },
        {
          areaName: "여신의 흔적 (경파)",
          levelRange: "50–70",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["1~2단계 반복", "경파 효율 극대화"],
        },
        {
          areaName: "여신의 흔적 (완파)",
          levelRange: "60–70",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["모든 단계 클리어", "주문서 보상"],
        },
      ],
    },
    {
      mapName: "루디브리엄",
      areas: [
        {
          areaName: "테라스홀 / 하늘테라스 1",
          levelRange: "28–38",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "도적"],
          notes: ["좁은 맵", "낚시 사냥 가능"],
        },
        {
          areaName: "에오스탑 100층",
          levelRange: "30–40",
          playStyle: ["solo", "party"],
          recommendedFor: ["전사", "법사"],
          notes: ["구조물 방해 주의", "좁은 맵"],
        },
        {
          areaName: "에오스탑 94층",
          levelRange: "32–40",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["낚시 사냥 편리", "경험치 효율 보통"],
        },
        {
          areaName: "에오스탑 95층",
          levelRange: "32–42",
          playStyle: ["solo"],
          recommendedFor: ["전사", "법사"],
          notes: ["높은 경험치 효율", "뭉친 젠 활용"],
        },
        {
          areaName: "핼리오스탑 99층",
          levelRange: "35–40",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["낚시 사냥 가능", "94층과 동일 구조"],
        },
        {
          areaName: "차원의 균열 (경파)",
          levelRange: "35–42",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["1~3단계만 빠르게 반복", "경파 방식"],
        },
        {
          areaName: "차원의 균열 (완파)",
          levelRange: "35–50",
          playStyle: ["party"],
          recommendedFor: ["all jobs except 전사"],
          notes: ["모든 단계 클리어", "주문서 보상"],
        },
        {
          areaName: "시간의 길 1",
          levelRange: "36–45",
          playStyle: ["party", "support"],
          recommendedFor: ["all jobs"],
          notes: ["심쩔 파티 추천", "버프 의존도 높음"],
        },
        {
          areaName: "시간의 길 4",
          levelRange: "41–55",
          playStyle: ["party", "support"],
          recommendedFor: ["all jobs"],
          notes: ["심쩔 파티", "좁은 맵"],
        },
      ],
    },
    {
      mapName: "아쿠아리움",
      areas: [
        {
          areaName: "수정협곡",
          levelRange: "40–50",
          playStyle: ["solo"],
          recommendedFor: ["all jobs"],
          notes: ["물개 사냥 편리", "귀속 아이템 파밍"],
        },
        {
          areaName: "붉은 산호숲",
          levelRange: "40–55",
          playStyle: ["solo", "party"],
          recommendedFor: ["all jobs"],
          notes: ["프리져 폭젠", "플레이어 이동 편리"],
        },
        {
          areaName: "위험한 동굴",
          levelRange: "40–50",
          playStyle: ["solo"],
          recommendedFor: ["궁수", "법사", "도적"],
          notes: ["제자리 사냥 가능", "접근 경로 번거로움"],
        },
        {
          areaName: "깊은 바다 협곡 2",
          levelRange: "90+",
          playStyle: ["solo"],
          recommendedFor: ["크루세이더", "궁수"],
          notes: ["솔플 오징어 사냥", "파밍용 장소"],
        },
      ],
    },
    {
      mapName: "리프레",
      areas: [
        {
          areaName: "하늘둥지 입구",
          levelRange: "80–100",
          playStyle: ["solo", "support"],
          recommendedFor: ["썬콜", "용기사"],
          notes: ["2층 낚시 포지션", "로어 팟"],
        },
        {
          areaName: "숲의 갈림길",
          levelRange: "90–100",
          playStyle: ["solo", "party"],
          recommendedFor: ["썬콜", "나이트", "저격수"],
          notes: ["듀얼버크 파밍(일비)", "파티 사냥 가능"],
        },
        {
          areaName: "붉은 켄타우로스의 영역",
          levelRange: "83–100",
          playStyle: ["solo", "party"],
          recommendedFor: ["썬콜", "궁수", "도적"],
          notes: ["옥상에 원거리 격수, 1층에 썬콜 위치"],
        },
      ],
    },
    {
      mapName: "대만 야시장",
      areas: [
        {
          areaName: "거리 3",
          levelRange: "50–65",
          playStyle: ["solo"],
          recommendedFor: ["전사", "궁수", "썬콜"],
          notes: ["인형자판기 분열 몹 활용", "버블티 관리 필요"],
        },
        {
          areaName: "사잇길 1",
          levelRange: "65–85",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["홀리심볼 파티 최적", "예티 자판기 다수"],
        },
      ],
    },
    {
      mapName: "엘나스",
      areas: [
        {
          areaName: "오르비스 탑 1층",
          levelRange: "35–40",
          playStyle: ["solo"],
          recommendedFor: ["전사", "법사"],
          notes: ["좁은 맵", "주문서 드랍 희귀"],
        },
        {
          areaName: "죽은 나무의 숲 1",
          levelRange: "52–81",
          playStyle: ["support"],
          recommendedFor: ["all jobs"],
          notes: ["심쩔 전용", "효율 최고"],
        },
        {
          areaName: "죽은 나무의 숲 2/3/4",
          levelRange: "57–81",
          playStyle: ["solo", "party", "support"],
          recommendedFor: ["all jobs"],
          notes: ["솔플·파티·심쩔 모두 가능"],
        },
        {
          areaName: "차가운 벌판 1",
          levelRange: "55–70",
          playStyle: ["solo"],
          recommendedFor: ["all jobs"],
          notes: ["헥터 꼬리 파밍", "균형 잡힌 사냥터"],
        },
        {
          areaName: "차디찬 벌판",
          levelRange: "60–80",
          playStyle: ["party"],
          recommendedFor: ["all jobs"],
          notes: ["6인 파티 사냥터", "인기 사냥터"],
        },
      ],
    },
  ],
};

/**
 * 메이플랜드 사냥터 데이터를 관리하는 메인 훅
 */
export const useHuntingData = () => {
  // 모든 사냥터 데이터 (변환된 형태)
  const allAreas = useMemo(() => transform(HUNTING_DATA), []);

  // 사용 가능한 맵 목록
  const availableMaps = useMemo(
    () => Array.from(new Set(allAreas.map((area) => area.mapName))),
    [allAreas]
  );

  // 통계 정보
  const statistics = useMemo(() => calcStats(allAreas), [allAreas]);

  return {
    allAreas,
    availableMaps,
    statistics,
    rawData: HUNTING_DATA,
  };
};

/**
 * 필터링 기능을 포함한 사냥터 데이터 훅
 */
export const useFilteredHuntingData = () => {
  const { allAreas, availableMaps, statistics } = useHuntingData();

  // 필터 상태
  const [filters, setFilters] = useState<HuntingFilters>({
    searchTerm: "",
    selectedLevel: "",
    selectedJob: "",
    selectedMap: "",
    playStyleFilter: "all",
    quickFilter: "all",
  });

  // 필터링된 데이터
  const filteredAreas = useMemo(
    () => filter(allAreas, filters),
    [allAreas, filters]
  );

  // 레벨 기반 추천
  const recommendations = useMemo(() => {
    if (!filters.selectedLevel) return [];
    return getRecommendations(allAreas, parseInt(filters.selectedLevel));
  }, [allAreas, filters.selectedLevel]);

  // 필터 업데이트 함수
  const updateFilter = useCallback(
    <K extends keyof HuntingFilters>(key: K, value: HuntingFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedLevel: "",
      selectedJob: "",
      selectedMap: "",
      playStyleFilter: "all",
      quickFilter: "all",
    });
  }, []);

  // 레벨 적합도 확인
  const isOptimalForLevel = useCallback((area: HuntingArea, level?: number) => {
    if (!level) return false;
    const centerLevel = (area.minLevel + area.maxLevel) / 2;
    return Math.abs(level - centerLevel) <= 5;
  }, []);

  return {
    // 데이터
    allAreas,
    filteredAreas,
    availableMaps,
    statistics,
    recommendations,

    // 필터
    filters,
    updateFilter,
    resetFilters,

    // 유틸리티
    isOptimalForLevel,
    totalCount: allAreas.length,
    filteredCount: filteredAreas.length,
  };
};
