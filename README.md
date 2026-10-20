# 이거어디버려 - Vercel 배포 패키지

프론트엔드와 백엔드(서버리스)가 분리된 안전한 프로덕션용 코드입니다.

## 배포 방법 (GitHub & Vercel)
1. 압축을 푼 폴더를 VSCode 등으로 엽니다.
2. 이 코드를 본인의 **GitHub Repository**에 푸시(Push)합니다.
3. [Vercel](https://vercel.com)에 로그인 후 `Add New Project`를 클릭합니다.
4. 방금 만든 GitHub Repository를 Import 합니다.
5. **Environment Variables (환경 변수)** 탭을 열고 아래 값을 추가합니다:
   - Key: `GEMINI_API_KEY`
   - Value: `(본인이 구글 AI 스튜디오에서 발급받은 API 키)`
6. `Deploy` 버튼을 누르면 배포가 완료됩니다!