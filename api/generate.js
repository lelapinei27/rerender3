export const config = {
  maxDuration: 60, // 무료 티어의 최대 응답 허용 시간
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 메서드만 지원합니다.' });
  }

  // 👉 Vercel 프로젝트 설정의 Environment Variables에서 API 키를 안전하게 읽어옵니다.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 API 키가 설정되지 않았습니다. (Vercel 환경변수 GEMINI_API_KEY를 확인하세요)' });
  }

  const { textQuery, imageBase64 } = req.body;

  try {
    const systemInstruction = `당신은 대한민국 분리수거 전문가 AI입니다.
반드시 아래 JSON 형식으로만 응답하세요. 마크다운(\\`\\`\\`) 기호는 절대 쓰지 마세요.
{
    "item": "물건 이름",
    "category": "배출 카테고리",
    "steps": ["1단계", "2단계"],
    "reason": "분류 이유"
}`;

    let parts = [];

    if (imageBase64) {
        parts.push({ text: "이 사진 속 물건의 정확한 분리수거 방법을 알려줘." });
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
            }
        });
    } else if (textQuery) {
        parts.push({ text: `이 물건의 분리수거 방법을 알려줘: ${textQuery}` });
    } else {
        return res.status(400).json({ error: "검색어나 이미지가 제공되지 않았습니다." });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: parts }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
        const errorMsg = responseData.error?.message || '알 수 없는 오류';
        return res.status(response.status).json({ error: `[API 에러] ${errorMsg}` });
    }

    // 서버 처리가 성공적으로 완료되면 프론트엔드로 전달
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: '서버 내부 처리 중 오류가 발생했습니다: ' + error.message });
  }
}