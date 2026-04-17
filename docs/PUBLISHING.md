# GitHub 공개 배포 체크리스트

## 저장소 설명 문구

- Korean: `Codex를 다시 열기 전에 가장 여유 있는 계정으로 빠르게 바꾸는 Windows 앱`
- English: `Windows app for switching to the best available Codex account before reopening Codex`

## 최초 Git 업로드

```bash
git init
git branch -M main
git add .
git commit -m "Prepare public release package"
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## 공개 전 확인

- `npm run lint`
- `npm test`
- `npm run screenshots:capture`
- `npm run dist:win`
- README 이미지가 정상 렌더링되는지 확인
- `release/` 안에 설치형 EXE와 휴대용 ZIP이 모두 생성됐는지 확인

## 첫 릴리스 예시

```bash
git tag v0.1.0
git push origin v0.1.0
```

`v*` 태그가 푸시되면 GitHub Actions가 Windows 릴리스 빌드를 실행하도록 구성했습니다.

## GitHub Actions Secrets

이 저장소의 현재 릴리스 워크플로는 별도 비밀값 없이 unsigned Windows 배포물을 업로드합니다. 코드 서명이나 자동 업데이트를 추가할 경우에만 추가 secrets가 필요합니다.

## 수동 릴리스 작성 팁

- 제목: `v0.1.0 - First public Windows release`
- 본문: [docs/RELEASE_TEMPLATE.md](docs/RELEASE_TEMPLATE.md) 기준으로 작성
- 첨부 파일:
  - `OAuth Account Switcher-<version>-x64.exe`
  - `OAuth Account Switcher-<version>-x64.zip`
