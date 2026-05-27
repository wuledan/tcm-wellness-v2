import { NextRequest, NextResponse } from "next/server";
import { addFeedback, readFeedback } from "@/lib/feedback";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, category, message, email, page } = body;

    // Validate
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }
    if (!["bug", "feature", "praise", "other"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message too short (min 10 chars)" }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 chars)" }, { status: 400 });
    }
    if (email && (typeof email !== "string" || email.length > 200 || !email.includes("@"))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      rating,
      category,
      message: message.trim(),
      email: email?.trim() || undefined,
      page: page || "",
      timestamp: new Date().toISOString(),
    };

    await addFeedback(entry);

    // Also log for Vercel log drain
    console.log("[FEEDBACK]", JSON.stringify(entry));

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const entries = await readFeedback();
  // Return newest first
  const sorted = [...entries].reverse();
  return NextResponse.json({ feedback: sorted, total: sorted.length });
}
