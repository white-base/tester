# React Native CRUD 샘플

간단한 연락처(Contact) 관리 CRUD 화면을 구현한 React Native 예제입니다. `App.js` 와 두 개의 프레젠테이션 컴포넌트, 그리고 상태를 관리하는 `useContacts` 커스텀 훅으로 구성되어 있습니다.

## 주요 기능
- 연락처 목록 조회(READ)
- 새 연락처 추가(CREATE)
- 기존 연락처 수정(UPDATE)
- 연락처 삭제(DELETE)
- 총 연락처 수/회사 수 집계

## 파일 구조
```
App.js
components/
  ContactForm.js
  ContactItem.js
hooks/
  useContacts.js
```

## 로컬 실행
1. React Native 개발 환경이 준비되어 있어야 합니다(Xcode/Android Studio, CocoaPods 등).
2. 의존성 설치:
   ```bash
   npm install
   ```
   iOS 환경이라면 Pods도 설치합니다 (Xcode가 설치되어 있어야 합니다):
   ```bash
   cd ios && npx pod-install
   ```
3. Metro 번들러 실행:
   ```bash
   npm run start
   ```
4. 앱 실행:
   - iOS: `npm run ios`
   - Android: `npm run android`

## 커스터마이징 팁
- `hooks/useContacts.js` 의 `seededContacts` 배열을 수정하면 초기 데이터가 변경됩니다.
- 서버 연동을 하고 싶다면 `useContacts` 훅 내부에서 API 호출을 수행하고 상태를 동기화할 수 있습니다.
- 입력 검증을 강화하려면 `components/ContactForm.js` 에서 정규식 검사나 에러 메시지를 추가하세요.
