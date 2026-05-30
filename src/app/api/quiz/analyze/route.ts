import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const API_KEY = "sk-f0T5tXizIYzrLDB5L5kDJ0pwpfqdoRNxqE22aopWktYwYEdIFaVHMSuQ10f9ahJC";
const API_BASE = "https://opencode.ai/zen/go/v1";

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
    const session = await auth();
    const body = await request.json();
    const { answers, language } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    const langMap: Record<string, string> = {
      en: "English",
      zh: "Chinese",
      ko: "Korean",
      vi: "Vietnamese",
    };
    const replyLang = langMap[language] || "English";

    const userPrompt = `Based on the following quiz answers, determine the user's TCM body constitution type:

${JSON.stringify(answers, null, 2)}

IMPORTANT: Reply in ${replyLang}.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "primary_type": "constitution_id",
  "secondary_type": "constitution_id or null",
  "confidence": 0.85,
  "summary_zh": "2-3句中文分析说明",
  "summary_en": "2-3 sentence analysis in ${replyLang}"
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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        reasoning_effort: "disabled",
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    const primaryType = result.primary_type || "balanced";
    const confidence = typeof result.confidence === "number" ? result.confidence : 0.5;

    // Save quiz attempt to DB (fire-and-forget to avoid slowing response)
    if (session?.user?.id && prisma) {
      prisma.quizAttempt
        .create({
          data: {
            userId: session.user.id,
            constitution: primaryType,
            answers,
            confidence,
          },
        })
        .catch((err) => console.error("Failed to save quiz attempt:", err));
    }

    return NextResponse.json({
      primary_type: primaryType,
      secondary_type: result.secondary_type || null,
      confidence,
      summary_zh: result.summary_zh || "",
      summary_en: result.summary_en || "",
    });
  } catch (error) {
    console.error("Quiz analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
