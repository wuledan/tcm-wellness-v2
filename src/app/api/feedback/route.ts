import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  email?: string;
  page: string;
  timestamp: string;
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

const FEEDBACK_KEY = "tcm:feedback";

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

    const entry: FeedbackEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      rating,
      category,
      message: message.trim(),
      email: email?.trim() || undefined,
      page: page || "",
      timestamp: new Date().toISOString(),
    };

    // Store in Redis (list with newest first prepend)
    await redis.lpush(FEEDBACK_KEY, entry);

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all feedback entries, newest first (LPUSH → index 0 is newest)
    const feedback = await redis.lrange<FeedbackEntry>(FEEDBACK_KEY, 0, -1);
    return NextResponse.json({ feedback, total: feedback.length });
  } catch {
    return NextResponse.json({ feedback: [], total: 0 });
  }
}
