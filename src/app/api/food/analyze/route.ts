import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const QWEN_API_KEY = "sk-16d61d52eba94add8bd6968c8c744df6";
const QWEN_API_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1";

const DS_API_KEY = "sk-f0T5tXizIYzrLDB5L5kDJ0pwpfqdoRNxqE22aopWktYwYEdIFaVHMSuQ10f9ahJC";
const DS_API_BASE = "https://opencode.ai/zen/go/v1";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { image, constitutionType, language } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const langMap: Record<string, string> = { en: "English", zh: "Chinese", ko: "Korean", vi: "Vietnamese" };
    const replyLang = langMap[language] || "English";

    // ========== Step 1: Identify food via Qwen-VL-Plus (Vision) ==========
    const visionResponse = await fetch(`${QWEN_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-vl-plus",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Identify the main food or dish in this image. 
Respond in JSON ONLY (no markdown, no code fences):
{"name_en":"food name in English","name_zh":"食物中文名","description":"brief description of how it looks","estimated_calories_per_100g":number}`,
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.1,
      }),
    });

    if (!visionResponse.ok) {
      const errText = await visionResponse.text();
      console.error("Vision API error:", visionResponse.status, errText);
      return NextResponse.json({ error: "Food recognition failed" }, { status: 502 });
    }

    const visionData = await visionResponse.json();
    const visionContent = visionData.choices?.[0]?.message?.content || "{}";

    // Parse food info, stripping any markdown code fences
    const cleaned = visionContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let foodInfo: Record<string, any>;
    try {
      foodInfo = JSON.parse(cleaned);
    } catch {
      // Fallback: extract name_en from raw text
      const match = cleaned.match(/"name_en"\s*:\s*"([^"]+)"/);
      foodInfo = { name_en: match?.[1] || "Unknown", name_zh: "", estimated_calories_per_100g: 100 };
    }

    // ========== Step 2: TCM Analysis via DeepSeek V4 Flash ==========
    const constitutionLabel = constitutionType || "balanced";
    const tcmPrompt = `You are a TCM food expert. Analyze this food for a ${constitutionLabel} constitution.

Food identified: ${foodInfo.name_en} (${foodInfo.name_zh || ""})
Estimated calories: ~${foodInfo.estimated_calories_per_100g || 100}kcal/100g

Respond in ${replyLang}. Return ONLY valid JSON:
{
  "tcm_property": "cold|cool|neutral|warm|hot",
  "tcm_property_zh": "寒|凉|平|温|热",
  "match_level": "suitable|caution|avoid",
  "reason_en": "explanation in ${replyLang} (2-3 sentences)",
  "reason_zh": "2-3句中文分析",
  "alternative_name": "better alternative food in ${replyLang}",
  "alternative_name_zh": "中文替代食物名",
  "alternative_property": "cold|cool|neutral|warm|hot",
  "alternative_match": "suitable|caution|avoid"
}`;

    const tcmResponse = await fetch(`${DS_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [{ role: "user", content: tcmPrompt }],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });

    if (!tcmResponse.ok) {
      const errText = await tcmResponse.text();
      console.error("TCM API error:", tcmResponse.status, errText);
      return NextResponse.json({ error: "TCM analysis failed" }, { status: 502 });
    }

    const tcmData = await tcmResponse.json();
    const tcmContent = tcmData.choices?.[0]?.message?.content || "{}";

    let tcmResult: Record<string, any>;
    try {
      tcmResult = JSON.parse(tcmContent);
    } catch {
      return NextResponse.json({ error: "Failed to parse TCM analysis" }, { status: 500 });
    }

    const foodName = foodInfo.name_en || "Unknown Food";
    const foodNameZh = foodInfo.name_zh || "";
    const matchLevel = tcmResult.match_level || "caution";
    const tcmProperty = tcmResult.tcm_property || "neutral";

    // Save food scan to DB (fire-and-forget)
    if (session?.user?.id && prisma) {
      prisma.foodScan
        .create({
          data: {
            userId: session.user.id,
            foodName,
            foodNameZh,
            matchLevel,
            tcmProperty,
          },
        })
        .catch((err) => console.error("Failed to save food scan:", err));
    }

    // ========== Combine results ==========
    return NextResponse.json({
      food_name: foodName,
      food_name_zh: foodNameZh,
      estimated_calories: foodInfo.estimated_calories_per_100g || 100,
      tcm_property: tcmProperty,
      tcm_property_zh: tcmResult.tcm_property_zh || "平",
      match_level: matchLevel,
      reason_en: tcmResult.reason_en || "",
      reason_zh: tcmResult.reason_zh || "",
      alternative_name: tcmResult.alternative_name || "",
      alternative_name_zh: tcmResult.alternative_name_zh || "",
      alternative_property: tcmResult.alternative_property || "neutral",
      alternative_match: tcmResult.alternative_match || "suitable",
    });
  } catch (error) {
    console.error("Food analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
