// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((val: T) => T);

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

/**
 * 로컬 스토리지와 동기화되는 상태를 관리하는 훅
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // 로컬 스토리지에서 값 읽기
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // 함수형 업데이트 지원
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // 커스텀 이벤트 발생 (다른 탭에서 감지 가능)
          window.dispatchEvent(new Event("local-storage"));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 다른 탭에서의 변경사항 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    const handleCustomStorageEvent = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(
          `Error reading localStorage key "${key}" on custom event:`,
          error
        );
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("local-storage", handleCustomStorageEvent);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("local-storage", handleCustomStorageEvent);
      };
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * 사용자 설정을 관리하는 훅
 */
export function useUserSettings() {
  interface UserSettings {
    theme: "light" | "dark" | "system";
    language: "ko" | "en";
    defaultProbability: number;
    defaultTrials: number;
    showTips: boolean;
    animationsEnabled: boolean;
    compactMode: boolean;
  }

  const defaultSettings: UserSettings = {
    theme: "dark",
    language: "ko",
    defaultProbability: 10,
    defaultTrials: 10,
    showTips: true,
    animationsEnabled: true,
    compactMode: false,
  };

  const [settings, setSettings, removeSettings] = useLocalStorage(
    "user-settings",
    defaultSettings
  );

  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings, defaultSettings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    removeSettings,
  };
}

/**
 * 계산 히스토리를 영구 저장하는 훅
 */
export function usePersistedHistory() {
  const [history, setHistory, removeHistory] = useLocalStorage<HistoryItem[]>(
    "calculation-history",
    []
  );

  const addToHistory = useCallback(
    (item: any) => {
      setHistory((prev: any[]) => [item, ...prev.slice(0, 99)]);
    },
    [setHistory]
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev: any[]) => prev.filter((item: any) => item.id !== id));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    removeAllHistory: removeHistory,
  };
}

/**
 * 즐겨찾기를 관리하는 훅
 */
export function useFavorites<T extends string>(key: string) {
  const [favorites, setFavorites, removeFavorites] = useLocalStorage<T[]>(
    `favorites-${key}`,
    []
  );

  const addFavorite = useCallback(
    (item: T) => {
      setFavorites((prev) => [...prev, item]);
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (item: T) => {
      setFavorites((prev) => prev.filter((fav) => fav !== item));
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (item: T) => {
      setFavorites((prev) =>
        prev.includes(item)
          ? prev.filter((fav) => fav !== item)
          : [...prev, item]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (item: T) => {
      return favorites.includes(item);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    removeAllFavorites: removeFavorites,
  };
}

/**
 * 앱 사용 통계를 추적하는 훅
 */
export function useUsageStats() {
  interface UsageStats {
    totalCalculations: number;
    totalTimeSpent: number; // 분 단위
    lastVisit: string;
    visitCount: number;
    favoriteFeatures: string[];
    firstVisit: string;
  }

  const defaultStats: UsageStats = {
    totalCalculations: 0,
    totalTimeSpent: 0,
    lastVisit: new Date().toISOString(),
    visitCount: 0,
    favoriteFeatures: [],
    firstVisit: new Date().toISOString(),
  };

  const [stats, setStats] = useLocalStorage("usage-stats", defaultStats);

  const incrementCalculations = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalCalculations: prev.totalCalculations + 1,
    }));
  }, [setStats]);

  const addTimeSpent = useCallback(
    (minutes: number) => {
      setStats((prev) => ({
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + minutes,
      }));
    },
    [setStats]
  );

  const updateVisit = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      lastVisit: new Date().toISOString(),
      visitCount: prev.visitCount + 1,
    }));
  }, [setStats]);

  const addFavoriteFeature = useCallback(
    (feature: string) => {
      setStats((prev) => ({
        ...prev,
        favoriteFeatures: [...new Set([...prev.favoriteFeatures, feature])],
      }));
    },
    [setStats]
  );

  // 컴포넌트 마운트 시 방문 기록
  useEffect(() => {
    updateVisit();
  }, [updateVisit]);

  return {
    stats,
    incrementCalculations,
    addTimeSpent,
    addFavoriteFeature,
  };
}
