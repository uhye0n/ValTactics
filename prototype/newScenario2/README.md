# VALORANT 시나리오 생성 인터페이스

이 프로젝트는 VALORANT 게임을 위한 시나리오 생성 인터페이스입니다. React와 TypeScript, Tailwind CSS를 사용하여 구현되었습니다.

## 프로젝트 구조

```
├── App.tsx                          # 메인 애플리케이션 컴포넌트
├── styles/globals.css              # Tailwind V4 전역 스타일
├── imports/
│   ├── svg-xzxk7hou0o.ts          # SVG 경로 데이터
│   └── NewScenario.tsx            # Figma 임포트 컴포넌트
├── components/
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # 이미지 폴백 컴포넌트
│   └── ui/                        # shadcn/ui 컴포넌트들
└── Attributions.md                # 라이선스 정보

```

## 주요 기능

1. **네비게이션 헤더**: 뒤로가기, 로고, 로그인 링크
2. **맵 선택**: 10개의 VALORANT 맵 중 선택
3. **요원 선택**: 우리 팀과 상대 팀 요원 선택 (각 20명)
4. **템플릿 시스템**: 미리 정의된 전략 템플릿
5. **시나리오 생성**: 선택된 설정으로 시나리오 생성

## 기술 스택

- **React 18** with TypeScript
- **Tailwind CSS V4** 
- **Framer Motion** (애니메이션용)
- **shadcn/ui** 컴포넌트 라이브러리

## 디자인 특징

- 다크 테마 기반 UI
- VALORANT 게임 스타일 디자인
- 정확한 Figma 디자인 구현
- 반응형 레이아웃 (909px 컨테이너 기준)
- 커스텀 언더라인과 하이라이트 효과

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 컴포넌트 구조

- `NavigationHeader`: 상단 네비게이션
- `MapSelection`: 맵 선택 그리드
- `AgentSection`: 요원 선택 그리드  
- `TemplateSection`: 템플릿 카드들
- `GenerateButton`: 시나리오 생성 버튼
- `UnderlineWithHighlights`: 공통 언더라인 컴포넌트

## 스타일링

Tailwind V4를 사용하며, 커스텀 폰트와 색상을 적용했습니다:
- Akshar 폰트 (네비게이션 및 본문)
- Gajraj One 폰트 (로고)
- FONTSPRING DEMO - Anguita Sans Black (맵 이름)
- Fascinate 폰트 (섹션 제목)

## 이미지 에셋

모든 게임 관련 이미지는 `figma:asset/` 경로를 통해 임포트됩니다:
- 맵 이미지 (10개)
- 요원 포트레이트 (20개)
- 배경 이미지
- 템플릿 아이콘