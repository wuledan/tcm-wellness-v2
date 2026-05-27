"use client";

import { useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

type Category = "bug" | "feature" | "praise" | "other";

interface Props {
  onClose: () => void;
}

const STARS = [1, 2, 3, 4, 5];
const CATEGORIES: Category[] = ["bug", "feature", "praise", "other"];

export default function FeedbackModal({ onClose }: Props) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [category, setCategory] = useState<Category | "">("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = rating > 0 && category !== "" && message.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category,
          message: message.trim(),
          email: email.trim() || undefined,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setTimeout(onClose, 2500);
    } catch {
      setStatus("error");
      setErrorMsg(t("feedback.error"));
    }
  }

  if (status === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in">
          <div className="text-5xl mb-4">🌿</div>
          <p className="text-lg font-medium text-gray-800">{t("feedback.success")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t("feedback.title")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("feedback.subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={t("feedback.close")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("feedback.rating")}</label>
            <div className="flex gap-1">
              {STARS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  {star <= (hoveredStar || rating) ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-gray-300">☆</span>
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-400 self-center ml-2">{rating}/5</span>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("feedback.category")}</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left ${
                    category === cat
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t(`feedback.categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("feedback.message")}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("feedback.messagePlaceholder")}
              rows={4}
              maxLength={1000}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                {message.length < 10 ? `${message.length}/10 min` : ""}
              </span>
              <span className="text-xs text-gray-400">{message.length}/1000</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("feedback.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("feedback.emailPlaceholder")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {status === "error" && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || status === "submitting"}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t("feedback.submitting")}
              </>
            ) : (
              t("feedback.submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
