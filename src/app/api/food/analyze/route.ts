import { NextRequest, NextResponse } from "next/server";

const API_KEY = "sk-f0T5tXizIYzrLDB5L5kDJ0pwpfqdoRNxqE22aopWktYwYEdIFaVHMSuQ10f9ahJC";
const API_BASE = "https://opencode.ai/zen/go/v1";

const SYSTEM_PROMPT = `You are a TCM (Traditional Chinese Medicine) food analysis expert. Analyze food images and provide TCM property classification and constitution compatibility assessment.

TCM food properties: cold (寒), cool (凉), neutral (平), warm (温), hot (热).

Match levels:
- "suitable": The food's TCM property complements or balances the user's constitution.
- "caution": The food may have mild conflict with the constitution; small amounts are OK.
- "avoid": The food's property conflicts significantly with the constitution.

Always provide a suitable alternative food suggestion.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, constitutionType, language } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const langMap: Record<string, string> = {
      en: "English",
      zh: "Chinese",
      ko: "Korean",
      vi: "Vietnamese",
    };
    const replyLang = langMap[language] || "English";

    const userPrompt = `Analyze this food image for a person with constitution type "${constitutionType || "balanced"}".

IMPORTANT: Reply in ${replyLang}.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "food_name": "food name (in ${replyLang})",
  "food_name_zh": "食物中文名",
  "estimated_calories": 550,
  "tcm_property": "warm",
  "tcm_property_zh": "温",
  "match_level": "avoid",
  "reason_en": "explanation in ${replyLang} (2-3 sentences)",
  "reason_zh": "2-3句中文分析说明",
  "alternative_name": "alternative food name (in ${replyLang})",
  "alternative_name_zh": "清蒸鱼",
  "alternative_property": "neutral",
  "alternative_match": "suitable"
}`;

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: image, detail: "low" } },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Vision API error:", response.status, errorText);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    return NextResponse.json({
      food_name: result.food_name || "Unknown Food",
      food_name_zh: result.food_name_zh || "未知食物",
      estimated_calories: result.estimated_calories || 100,
      tcm_property: result.tcm_property || "neutral",
      tcm_property_zh: result.tcm_property_zh || "平",
      match_level: result.match_level || "caution",
      reason_en: result.reason_en || "",
      reason_zh: result.reason_zh || "",
      alternative_name: result.alternative_name || "",
      alternative_name_zh: result.alternative_name_zh || "",
      alternative_property: result.alternative_property || "neutral",
      alternative_match: result.alternative_match || "suitable",
    });
  } catch (error) {
    console.error("Food analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
