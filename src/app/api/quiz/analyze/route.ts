import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a TCM (Traditional Chinese Medicine) constitution analysis expert. Your role is to analyze quiz answers and determine the user's body constitution type according to the 9-type TCM constitution classification system.

The 9 constitution types are:
1. qi_deficiency (气虚质) — Qi Deficiency
2. yang_deficiency (阳虚质) — Yang Deficiency
3. yin_deficiency (阴虚质) — Yin Deficiency
4. phlegm_dampness (痰湿质) — Phlegm-Dampness
5. damp_heat (湿热质) — Damp-Heat
6. blood_stasis (血瘀质) — Blood Stasis
7. qi_stagnation (气郁质) — Qi Stagnation
8. intrinsic (特禀质) — Intrinsic/Allergic
9. balanced (平和质) — Balanced

Respond with a confidence score between 0 and 1 reflecting how certain you are about the primary type determination.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 503 });
    }

    const userPrompt = `Based on the following quiz answers, determine the user's TCM body constitution type:

${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "primary_type": "constitution_id",
  "secondary_type": "constitution_id or null",
  "confidence": 0.85,
  "summary_zh": "你的体质属于...，简短的个性化中文分析（2-3句话）",
  "summary_en": "Your body constitution is... (2-3 sentence English analysis)"
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      primary_type: result.primary_type || "balanced",
      secondary_type: result.secondary_type || null,
      confidence: typeof result.confidence === "number" ? result.confidence : 0.5,
      summary_zh: result.summary_zh || "",
      summary_en: result.summary_en || "",
    });
  } catch (error) {
    console.error("Quiz analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
