// utils/formatters.ts

/**
 * 숫자를 한국어 단위로 포맷팅
 * @param num 숫자
 * @returns 포맷된 문자열 (예: 1만, 10억)
 */
export const formatKoreanNumber = (num: number): string => {
  if (num === 0) return "0";

  const units = ["", "만", "억", "조"];
  const unitSize = 10000;

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    const currentUnit = num % unitSize;
    if (currentUnit > 0) {
      result = `${currentUnit}${units[unitIndex]}${result}`;
    }
    num = Math.floor(num / unitSize);
    unitIndex++;
  }

  return result;
};

/**
 * 날짜를 상대적 시간으로 포맷팅
 * @param date 날짜
 * @returns 상대적 시간 문자열 (예: 1분 전, 3시간 전)
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  if (months < 12) return `${months}개월 전`;
  return `${years}년 전`;
};

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date 날짜
 * @param includeTime 시간 포함 여부
 * @returns 포맷된 날짜 문자열
 */
export const formatKoreanDate = (date: Date, includeTime = false): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let result = `${year}년 ${month}월 ${day}일`;

  if (includeTime) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    result += ` ${period} ${displayHours}시`;
    if (minutes > 0) {
      result += ` ${minutes}분`;
    }
  }

  return result;
};

/**
 * 확률 값을 색상 클래스로 변환
 * @param probability 확률 값 (0~1)
 * @returns Tailwind 색상 클래스
 */
export const getProbabilityColor = (probability: number): string => {
  if (probability <= 0.15) return "text-red-400";
  if (probability <= 0.3) return "text-orange-400";
  if (probability <= 0.6) return "text-amber-400";
  if (probability <= 0.85) return "text-green-400";
  return "text-emerald-400";
};

/**
 * 효율성 수치를 별점으로 변환
 * @param efficiency 효율성 수치 (1~10)
 * @returns 별점 정보 객체
 */
export const formatEfficiencyStars = (
  efficiency: number
): {
  filled: number;
  empty: number;
  percentage: number;
} => {
  const total = 10;
  const filled = Math.min(Math.max(efficiency, 0), total);
  const empty = total - filled;
  const percentage = (filled / total) * 100;

  return { filled, empty, percentage };
};

/**
 * 숫자를 콤마로 구분된 문자열로 변환
 * @param num 숫자
 * @returns 콤마가 포함된 문자열
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

/**
 * 확률을 배지 스타일로 포맷팅
 * @param probability 확률 값 (0~1)
 * @returns 배지 스타일 정보
 */
export const formatProbabilityBadge = (
  probability: number
): {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
} => {
  const percent = Math.round(probability * 100);
  const text = `${percent}%`;

  if (probability <= 0.1) {
    return {
      text,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    };
  } else if (probability <= 0.3) {
    return {
      text,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    };
  } else if (probability <= 0.6) {
    return {
      text,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    };
  } else if (probability <= 0.9) {
    return {
      text,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    };
  } else {
    return {
      text,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    };
  }
};

/**
 * 레벨 범위를 파싱
 * @param levelRange 레벨 범위 문자열 (예: "10-30")
 * @returns 최소/최대 레벨
 */
export const parseLevelRange = (
  levelRange: string
): { min: number; max: number } => {
  const [min, max] = levelRange.split("-").map(Number);
  return { min: min || 0, max: max || 0 };
};

/**
 * 플레이 시간을 분 단위로 파싱
 * @param timeString 시간 문자열 (예: "15-25분", "1-2시간")
 * @returns 평균 분 수
 */
export const parseTimeToMinutes = (timeString: string): number => {
  if (timeString.includes("시간")) {
    const hours = timeString.match(/(\d+)-?(\d+)?시간/);
    if (hours) {
      const min = parseInt(hours[1]);
      const max = hours[2] ? parseInt(hours[2]) : min;
      return ((min + max) / 2) * 60;
    }
  }

  const minutes = timeString.match(/(\d+)-?(\d+)?분/);
  if (minutes) {
    const min = parseInt(minutes[1]);
    const max = minutes[2] ? parseInt(minutes[2]) : min;
    return (min + max) / 2;
  }

  return 0;
};

/**
 * 검색어 하이라이팅
 * @param text 원본 텍스트
 * @param searchTerm 검색어
 * @returns 하이라이팅된 텍스트 (HTML)
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string
): string => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
  );
};
