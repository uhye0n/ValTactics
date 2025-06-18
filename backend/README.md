# ValTactics Backend Setup

## 설치 및 실행 방법

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 데이터베이스 설정
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 생성 및 스키마 적용
npx prisma db push

# 맵 데이터 시딩
npm run db:seed
```

### 3. 개발 서버 실행
```bash
npm run dev
```

서버가 http://localhost:3001 에서 실행됩니다.

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 시나리오
- `GET /api/scenarios` - 시나리오 목록 조회
- `GET /api/scenarios/:id` - 특정 시나리오 조회
- `POST /api/scenarios` - 시나리오 생성
- `PUT /api/scenarios/:id` - 시나리오 수정
- `DELETE /api/scenarios/:id` - 시나리오 삭제
- `PUT /api/scenarios/:id/timeline` - 타임라인 업데이트
- `PUT /api/scenarios/:id/map-objects` - 맵 오브젝트 업데이트

### 맵
- `GET /api/maps` - 모든 맵 조회
- `GET /api/maps/:id` - 특정 맵 조회

### 사용자
- `GET /api/users/profile` - 사용자 프로필 조회
- `PUT /api/users/profile` - 사용자 프로필 업데이트

## 데이터베이스 구조

- **User**: 사용자 정보
- **Scenario**: 시나리오 기본 정보
- **TeamComposition**: 팀 구성 (우리팀/적팀 요원)
- **Timeline**: 시나리오 타임라인
- **TimelineEvent**: 타임라인 이벤트
- **PlayerAction**: 플레이어 액션 (이동, 스킬 사용 등)
- **MapObject**: 맵 오브젝트 (스파이크, 스모크, 벽 등)
- **ScenarioShare**: 시나리오 공유 설정
- **Map**: 맵 정보 (정적 데이터)

## 실시간 기능

Socket.IO를 통한 실시간 기능:
- 시나리오 편집 협업
- 타임라인 동기화
- 실시간 업데이트
