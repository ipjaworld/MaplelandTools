// utils/numberInputUtils.ts

export interface NumberInputOptions {
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  allowNegative?: boolean;
}

/**
 * 숫자 입력 값을 검증하고 포맷팅하는 함수
 */
export const validateAndFormatNumber = (
  value: string,
  options: NumberInputOptions = {}
): string => {
  const { decimals = 2, allowNegative = false } = options;

  // 빈 문자열은 그대로 유지
  if (value === "") return "";

  // 천 단위 구분자 제거
  const cleanValue = removeThousandSeparators(value);

  // 음수 허용 여부에 따른 정규식
  const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

  // 기본적인 숫자 형식 검증
  if (!regex.test(cleanValue)) {
    return value.slice(0, -1); // 마지막 입력 문자 제거
  }

  // 소수점 개수 제한
  const dotCount = (cleanValue.match(/\./g) || []).length;
  if (dotCount > 1) {
    return value.slice(0, -1);
  }

  // 소수점 자리수 제한
  if (decimals >= 0) {
    const parts = cleanValue.split(".");
    if (parts[1] && parts[1].length > decimals) {
      const limitedDecimal = `${parts[0]}.${parts[1].slice(0, decimals)}`;
      return addThousandSeparators(limitedDecimal);
    }
  }

  return addThousandSeparators(cleanValue);
};

/**
 * 문자열을 숫자로 변환하되, 빈 문자열이나 유효하지 않은 값은 기본값 반환
 */
export const parseNumberInput = (
  value: string,
  defaultValue: number = 0,
  options: NumberInputOptions = {}
): number => {
  const { min, max } = options;

  if (value === "" || value === "-") return defaultValue;

  // 천 단위 구분자 제거 후 파싱
  const cleanValue = removeThousandSeparators(value);
  const parsed = parseFloat(cleanValue);
  if (isNaN(parsed)) return defaultValue;

  // min/max 범위 적용
  let result = parsed;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;

  return result;
};

/**
 * 숫자를 표시용 문자열로 포맷팅 (천 단위 구분자 포함)
 */
export const formatNumberForDisplay = (
  value: number,
  options: NumberInputOptions = {}
): string => {
  const { decimals } = options;

  let formattedValue: string;

  if (decimals !== undefined && decimals >= 0) {
    formattedValue = value.toFixed(decimals).replace(/\.?0+$/, "");
  } else {
    formattedValue = value.toString();
  }

  // 천 단위 구분자 추가
  return addThousandSeparators(formattedValue);
};

/**
 * 천 단위 구분자를 추가하는 함수
 */
export const addThousandSeparators = (value: string): string => {
  if (value === "" || value === "-") return value;

  // 소수점과 정수부분 분리
  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // 음수 처리
  const isNegative = integerPart.startsWith("-");
  const absoluteInteger = isNegative ? integerPart.slice(1) : integerPart;

  // 천 단위 구분자 추가 (정규식 사용)
  const formattedInteger = absoluteInteger.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // 최종 결과 조합
  let result = isNegative ? "-" + formattedInteger : formattedInteger;
  if (decimalPart !== undefined) {
    result += "." + decimalPart;
  }

  return result;
};

/**
 * 천 단위 구분자를 제거하는 함수
 */
export const removeThousandSeparators = (value: string): string => {
  return value.replace(/,/g, "");
};

/**
 * 키보드 입력 이벤트 핸들러
 */
export const handleNumberKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  options: NumberInputOptions = {}
) => {
  const { allowNegative = false, decimals } = options;

  // 허용되는 키들
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];

  // 컨트롤 키와 함께 사용되는 경우 (복사, 붙여넣기 등)
  if (e.ctrlKey || e.metaKey) {
    return;
  }

  // 허용된 키인 경우 통과
  if (allowedKeys.includes(e.key)) {
    return;
  }

  const target = e.target as HTMLInputElement;
  const value = target.value;
  const selectionStart = target.selectionStart || 0;

  // 숫자 키 허용
  if (/^\d$/.test(e.key)) {
    return;
  }

  // 소수점 허용 (소수점이 허용되고, 아직 소수점이 없는 경우)
  if (e.key === "." && decimals !== 0 && !value.includes(".")) {
    return;
  }

  // 음수 허용 (맨 앞에서만, 아직 음수 기호가 없는 경우)
  if (
    e.key === "-" &&
    allowNegative &&
    selectionStart === 0 &&
    !value.includes("-")
  ) {
    return;
  }

  // 그 외의 키는 모두 차단
  e.preventDefault();
};

/**
 * 붙여넣기 이벤트 핸들러
 */
export const handleNumberPaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  options: NumberInputOptions = {}
) => {
  e.preventDefault();

  const pastedText = e.clipboardData.getData("text");
  const target = e.target as HTMLInputElement;
  const currentValue = target.value;
  const selectionStart = target.selectionStart || 0;
  const selectionEnd = target.selectionEnd || 0;

  // 현재 선택된 부분을 붙여넣을 텍스트로 교체
  const newValue =
    currentValue.slice(0, selectionStart) +
    pastedText +
    currentValue.slice(selectionEnd);

  // 새로운 값이 유효한지 검증
  const validatedValue = validateAndFormatNumber(newValue, options);

  // 유효한 경우에만 적용
  if (validatedValue !== currentValue) {
    target.value = validatedValue;

    // 커서 위치 조정 (천 단위 구분자로 인한 길이 변화 고려)
    const newCursorPos =
      selectionStart + (validatedValue.length - currentValue.length);
    target.setSelectionRange(newCursorPos, newCursorPos);

    // change 이벤트 발생
    const changeEvent = new Event("change", { bubbles: true });
    target.dispatchEvent(changeEvent);
  }
};
