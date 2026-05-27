import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "feedback.json");

export interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  email?: string;
  page: string;
  timestamp: string;
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    if (!existsSync(DATA_FILE)) {
      return [];
    }
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addFeedback(entry: FeedbackEntry): Promise<void> {
  await ensureDataDir();
  const entries = await readFeedback();
  entries.push(entry);
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}
