"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  email?: string;
  page: string;
  timestamp: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  bug: "🐛",
  feature: "💡",
  praise: "❤️",
  other: "📝",
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminFeedbackPage() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setEntries(data.feedback || []))
      .catch(() => setError("Failed to load feedback"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 inline-block">
        {t("admin.back")}
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("admin.title")}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {entries.length > 0
          ? `${entries.length} submission${entries.length !== 1 ? "s" : ""}`
          : ""}
      </p>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-400 mt-4">Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">{t("admin.empty")}</p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex gap-0.5" title={`${entry.rating}/5`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= entry.rating ? "text-yellow-400" : "text-gray-200"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {/* Category */}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {CATEGORY_ICONS[entry.category]} {t(`feedback.categories.${entry.category}`) || entry.category}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{formatTime(entry.timestamp)}</span>
              </div>

              <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{entry.message}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                {entry.email && <span>📧 {entry.email}</span>}
                {entry.page && <span>📄 {entry.page}</span>}
                <span className="font-mono text-gray-300">#{entry.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
