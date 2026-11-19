# yeop.net — Developer Portfolio

개발자 포트폴리오 사이트의 소스 저장소입니다.

## 브랜치 및 배포 규칙

- `develop`: 개발 통합 브랜치. 변경사항을 작성·검증하며 **운영 서버에 배포하지 않습니다**.
- `main`: 운영 브랜치. `develop`에서 검증한 변경사항을 Pull Request로 반영합니다.
- `master`: 2017년부터 존재한 기존 브랜치로, 레거시 이력 보존용이며 신규 배포 트리거가 아닙니다.
- 실제 호스팅 배포 트리거는 반드시 `refs/heads/main`으로만 제한합니다. 수동 실행도 `main` 외 브랜치에서는 거절해야 합니다.

## 운영 환경 및 배포 경계

- 포트폴리오: `https://yeop.net/`
- 기존 독립 서비스: `https://mir.yeop.net/`
- 공유 호스팅: inour.net (ISPConfig 계열)

기존 미르 사이트는 **별도 리포지토리** `seirian/mir-cheongwoon-site`에서 배포합니다.

과거 미르 배포 소스 기준 공유 웹 루트 `/web`에는 미르 서브도메인을 `/web/_mir_site`로 라우팅하는 .htaccess 브리지 규칙이 있습니다. 포트폴리오 배포 시 이 선행 규칙을 그대로 보존하고, 포트폴리오에 필요한 후속 규칙만 독립적으로 추가해야 합니다.

### 필수 안전장치

1. `/web/_mir_site/`, `/web/mir/`, `/web/_yeop_releases/` 등 기존 미르 관련 리소스의 삭제·이동·덮어쓰기·권한변경 금지.
2. `/web/.htaccess`를 통째로 교체하지 말 것. 기존 `MIR-SUBDOMAIN-BRIDGE-V1` 구간을 바이트 수준으로 보존하고 필요한 포트폴리오 규칙만 신중하게 추가할 것.
3. 새 배포 스크립트는 허용목록 경로만 수정하고, 배포 전 기존 파일 백업 및 배포 후 두 도메인 스모크 테스트를 수행할 것.
4. 포트폴리오 배포 전후 `https://mir.yeop.net/`과 대표 하위 경로가 정상인지 검사하고, 실패 시 포트폴리오 쪽 변경사항만 롤백할 것.
5. 미르 저장소의 GitHub Actions, 시크릿, DNS 및 팬아카이브 파일을 수정하지 말 것.
6. `main` 브랜치가 아닌 이벤트(pull_request, develop push 등)는 배포 권한을 갖지 않도록 할 것.
7. 실제 FTP/SFTP 연결 설정, 웹 루트, 백업·복구 동작 검증 전 운영 배포를 활성화하지 말 것.

## 원본 콘텐츠

- Notion 포트폴리오: https://yeops.notion.site/Portfolio-a13980c2a70b4f1f9e32e2f1b80fc193
- Notion 원본의 이력과 프로젝트 데이터 확인 전에는 경력·실적 정보를 추측해서 기재하지 않습니다.

## 개발 진행

디자인 및 콘텐츠를 `develop`에 작성하고 빌드/검증을 마친 뒤 `develop` → `main` PR을 통해 승격합니다.
