import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.DEEPSEEK_API_KEY || "";
const API_BASE = "https://opencode.ai/zen/go/v1";

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "DeepSeek API key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { constitutionType, constitutionName, season, language } = body;

    const typeLabel = constitutionName || constitutionType || "balanced constitution";
    const seasonLabel = season || "the current season";

    const langMap: Record<string, string> = { en: "English", zh: "Chinese", ko: "Korean", vi: "Vietnamese" };
    const replyLang = langMap[language] || "English";

    const userPrompt = `TCM wellness expert. Recommend for ${typeLabel} in ${seasonLabel}. Reply in ${replyLang}. Return JSON: {"meals":{"breakfast":{"name":"Meal name","name_zh":"中文","description":"Eng","description_zh":"中文","foods":["Oats","Yam"]},"lunch":{"name":"","name_zh":"","description":"","description_zh":"","foods":["Brown rice","Fish"]},"dinner":{"name":"","name_zh":"","description":"","description_zh":"","foods":["Soup","Tofu"]}},"exercise":{"name":"","name_zh":"","duration":"","description":"","description_zh":""},"lifestyle_tips":[{"tip_en":"","tip_zh":""},{"tip_en":"","tip_zh":""}]}. name and description in ${replyLang}. name_zh and description_zh in Chinese.`;

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return NextResponse.json({ error: "AI recommendation failed" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}
