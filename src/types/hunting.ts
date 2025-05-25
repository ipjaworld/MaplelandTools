// src/types/hunting.ts
// 메이플랜드 사냥터 관련 타입 정의

export interface HuntingContent {
  id: string;
  name: string;
  type: "hunting" | "partyquest" | "boss";
  map: string;
  levelRange: string;
  minLevel: number;
  maxLevel: number;
  expEfficiency: number; // 1-10 점수
  mesoEfficiency: number; // 1-10 점수
  difficulty: "Easy" | "Normal" | "Hard" | "Extreme";
  playStyle: "solo" | "party" | "both";
  isZeroBurn: boolean; // 쩔받는 용 적용 여부
  jobRecommendation: string[]; // 추천 직업군
  monsters: string[]; // 등장 몬스터
  description: string;
  tips: string[]; // 사냥 팁
  timeRequired?: string; // 소요 시간 (파티퀘스트, 보스용)
}

// JobCategory는 단순 문자열 배열로 사용되고 있음
export type JobCategory = string;