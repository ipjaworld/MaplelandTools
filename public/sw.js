// Service Worker for 메이플 독립시행 계산기
const CACHE_NAME = "maple-calculator-v1.0.0";
const STATIC_CACHE_NAME = "maple-calculator-static-v1";
const RUNTIME_CACHE_NAME = "maple-calculator-runtime-v1";

// 캐시할 정적 리소스들
const STATIC_ASSETS = [
  "/",
  "/calculator",
  "/hunting-grounds",
  "/history",
  "/about",
  "/manifest.json",
  // 아이콘들
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  // 폰트 (필요한 경우)
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
];

// 런타임에 캐시할 리소스 패턴들
const RUNTIME_CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/cdnjs\.cloudflare\.com/,
];

// 설치 이벤트 - 정적 리소스 캐시
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error);
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== RUNTIME_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Cache cleanup completed");
        return self.clients.claim();
      })
  );
});

// Fetch 이벤트 - 네트워크 요청 가로채기
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Chrome extension 요청은 무시
  if (url.protocol === "chrome-extension:") {
    return;
  }

  // HTML 페이지 요청 처리 (SPA 라우팅 지원)
  if (request.destination === "document") {
    event.respondWith(
      caches
        .match("/")
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request);
        })
        .catch(() => {
          return caches.match("/");
        })
    );
    return;
  }

  // 정적 리소스 요청 처리
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // 런타임 캐시 대상 리소스 처리
  const shouldCacheRuntime = RUNTIME_CACHE_PATTERNS.some((pattern) =>
    pattern.test(request.url)
  );

  if (shouldCacheRuntime) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // 백그라운드에서 업데이트
          fetch(request)
            .then((response) => {
              caches.open(RUNTIME_CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
              });
            })
            .catch(() => {
              // 네트워크 오류 무시
            });

          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 기본 네트워크 우선 전략
  event.respondWith(
    fetch(request).catch(() => {
      // 네트워크 실패 시 캐시에서 찾기
      return caches.match(request);
    })
  );
});

// 백그라운드 동기화 (PWA 고급 기능)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[SW] Background sync triggered");
    event.waitUntil(
      // 백그라운드에서 수행할 작업
      syncCalculationData()
    );
  }
});

// 푸시 알림 처리 (선택적)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey,
    },
    actions: [
      {
        action: "explore",
        title: "확인하기",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "닫기",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// 유틸리티 함수들
async function syncCalculationData() {
  try {
    // 로컬 스토리지의 데이터를 서버와 동기화
    // (실제 구현 시 필요한 경우)
    console.log("[SW] Syncing calculation data...");

    // 예시: IndexedDB에서 오프라인 데이터 가져오기
    // const data = await getOfflineData();
    // await syncWithServer(data);

    return Promise.resolve();
  } catch (error) {
    console.error("[SW] Sync failed:", error);
    return Promise.reject(error);
  }
}

// 캐시 크기 관리
async function cleanupCache() {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const requests = await cache.keys();

  if (requests.length > 50) {
    // 최대 50개 항목 유지
    const oldestRequests = requests.slice(0, requests.length - 50);
    await Promise.all(oldestRequests.map((request) => cache.delete(request)));
  }
}

// 정기적으로 캐시 정리
setInterval(cleanupCache, 60000); // 1분마다

// SW 업데이트 알림
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
