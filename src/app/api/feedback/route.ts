import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  email?: string;
  page: string;
  timestamp: string;
}

// In-memory store for fast access
let feedbackStore: FeedbackEntry[] | null = null;
const TMP_FILE = "/tmp/tcm-feedback.jsonl";

function loadFromDisk(): FeedbackEntry[] {
  try {
    if (existsSync(TMP_FILE)) {
      const raw = readFileSync(TMP_FILE, "utf-8");
      return raw
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
    }
  } catch {
    // ignore read errors
  }
  return [];
}

function ensureDir() {
  try {
    if (!existsSync("/tmp")) mkdirSync("/tmp", { recursive: true });
  } catch {
    // ignore
  }
}

function getStore(): FeedbackEntry[] {
  if (!feedbackStore) {
    feedbackStore = loadFromDisk();
  }
  return feedbackStore;
}

function addEntry(entry: FeedbackEntry) {
  const store = getStore();
  store.push(entry);
  ensureDir();
  try {
    appendFileSync(TMP_FILE, JSON.stringify(entry) + "\n");
  } catch {
    // ignore disk write errors
  }
}

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

    addEntry(entry);

    // Also log for Vercel log drain
    console.log("[FEEDBACK]", JSON.stringify(entry));

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const store = getStore();
  // Return newest first
  const sorted = [...store].reverse();
  return NextResponse.json({ feedback: sorted, total: sorted.length });
}
