# 메랜도구 (Mapleland Tools)

메이플랜드 플레이에 필요한 확률 계산과 사냥터 정보를 제공하는 브라우저 도구 모음입니다. 주문서·가챠 확률을 이항분포로 계산하고, 조건에 맞는 사냥터 데이터를 탐색할 수 있습니다.

**배포:** https://mapleland-tools-eight.vercel.app

## 주요 기능

### 확률 계산기

- 시행 횟수와 성공 확률에 따른 성공 횟수별 확률 분포
- N회 이상 성공할 누적 확률
- 목표 성공 횟수와 주문서 가격을 반영한 예상 비용 통계
- 메이플랜드 주문서·가챠 확률 프리셋
- Monte Carlo 시뮬레이션, 진행 상태, 결과 CSV 다운로드

### 사냥터 가이드

- 레벨, 직업, 지역, 플레이 스타일 조건 필터
- 검색어 기반 사냥터 탐색
- 입력 레벨에 맞는 추천과 데이터 통계
- 사냥터별 추천 직업 및 참고 사항 표시

### 계산 히스토리

- 현재 앱 세션에서 최근 계산 최대 50개 확인
- 성공 확률, 시행 횟수, 기댓값과 분포 미리보기
- 기록 전체 삭제

> 히스토리는 현재 React 상태에만 보관되므로 페이지를 새로고침하면 초기화됩니다. 화면에 보이는 일부 재계산·상세 버튼은 아직 동작이 연결되지 않았습니다.

## 기술 스택

- React 19, TypeScript
- Vite 6, React Router 7
- Tailwind CSS 4
- Radix UI, shadcn/ui 스타일 컴포넌트, Lucide React
- ESLint, Prettier, Husky, lint-staged

## 시작하기

요구 사항: Node.js 20 이상, npm

```bash
git clone https://github.com/ipjaworld/MaplelandTools.git
cd MaplelandTools
npm install
npm run dev
```

개발 서버 주소는 Vite가 터미널에 출력합니다.

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 타입 검사 후 프로덕션 빌드
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 검사
npm run format:check # Prettier 검사
npm run ci           # lint + type-check + format:check + build
```

## 화면 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 도구 모음 홈 |
| `/calculator` | 확률·비용 계산과 시뮬레이션 |
| `/hunting-grounds` | 사냥터 검색·필터·추천 |
| `/history` | 현재 세션의 계산 기록 |
| `/about` | 프로젝트 정보와 사용 안내 |

## 프로젝트 구조

```text
src/
├─ components/   # 계산기, 공통 UI 컴포넌트
├─ constants/    # 계산 프리셋과 사냥터 데이터
├─ contexts/     # 계산기 및 테마 상태
├─ hooks/        # 사냥터 필터와 로컬 저장 유틸리티
├─ layouts/      # 헤더, 내비게이션, 공통 레이아웃
├─ pages/        # 라우트별 화면
├─ types/        # 도메인 타입
└─ utils/        # 확률 계산 및 시뮬레이션 로직
```

## 현재 범위와 주의사항

- 별도 백엔드 없이 정적 데이터와 브라우저 상태로 동작합니다.
- 사냥터 정보는 코드에 포함된 참고 데이터이며 게임 업데이트에 따라 실제 효율과 달라질 수 있습니다.
- 계산 결과는 입력한 독립 시행 가정에 기반한 수학적 추정치이며 실제 게임 결과를 보장하지 않습니다.
- 서비스는 베타 단계이며 일부 보조 동작과 모바일 최적화가 진행 중입니다.
