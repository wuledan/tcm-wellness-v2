import { NextRequest, NextResponse } from "next/server";

const API_KEY = "sk-f0T5tXizIYzrLDB5L5kDJ0pwpfqdoRNxqE22aopWktYwYEdIFaVHMSuQ10f9ahJC";
const API_BASE = "https://opencode.ai/zen/go/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { constitutionType, constitutionName, season } = body;

    const typeLabel = constitutionName || constitutionType || "balanced constitution";
    const seasonLabel = season || "the current season";

    const userPrompt = `You are a TCM wellness expert. Provide daily personalized wellness recommendations for a person with ${typeLabel} constitution during ${seasonLabel}.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "meals": {
    "breakfast": {
      "name": "Warm Nourishing Porridge",
      "name_zh": "温补粥品",
      "description": "English description of this meal recommendation (1-2 sentences)",
      "description_zh": "中文描述（1-2句）",
      "foods": ["Oats", "Chinese Yam", "Red Dates"]
    },
    "lunch": {
      "name": "Balanced Rice Bowl",
      "name_zh": "均衡饭食",
      "description": "English description (1-2 sentences)",
      "description_zh": "中文描述（1-2句）",
      "foods": ["Brown rice", "Steamed fish", "Cooked vegetables"]
    },
    "dinner": {
      "name": "Light Soup Meal",
      "name_zh": "清淡汤品",
      "description": "English description (1-2 sentences)",
      "description_zh": "中文描述（1-2句）",
      "foods": ["Vegetable soup", "Tofu", "Mushrooms"]
    }
  },
  "exercise": {
    "name": "Recommended Exercise",
    "name_zh": "推荐运动",
    "duration": "30-45 minutes",
    "description": "English description of exercise recommendation",
    "description_zh": "中文运动建议说明"
  },
  "lifestyle_tips": [
    { "tip_en": "Go to bed before 11pm", "tip_zh": "晚上11点前入睡" },
    { "tip_en": "Another English tip", "tip_zh": "另一条中文建议" }
  ]
}`;

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
        reasoning_effort: "disabled",
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
