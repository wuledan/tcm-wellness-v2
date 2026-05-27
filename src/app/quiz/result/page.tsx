"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { constitutions } from "@/data/constitutions";
import { getQuizResult } from "@/lib/utils";

export default function QuizResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ReturnType<typeof getQuizResult>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const r = getQuizResult();
    if (!r) {
      router.push("/quiz");
      return;
    }
    setResult(r);
  }, [router]);

  if (!mounted || !result) return null;

  const constitution = constitutions.find((c) => c.id === result.primaryType);
  const secondary = result.secondaryType
    ? constitutions.find((c) => c.id === result.secondaryType)
    : null;

  if (!constitution) return null;

  const handleShare = () => {
    const text = `I discovered my body type: ${constitution.name_zh} (${constitution.name_en})! 🌿 Take the TCM body type quiz and discover yours.`;
    if (navigator.share) {
      navigator.share({ title: "My TCM Body Type", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Result Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="text-center py-10 px-6" style={{ backgroundColor: constitution.bgColor }}>
            <span className="text-6xl block mb-4">{constitution.emoji}</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {constitution.name_zh}
            </h1>
            <p className="text-lg text-gray-500 mb-4">{constitution.name_en}</p>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: constitution.color + "30", color: constitution.color }}
            >
              Your Primary Body Type
            </span>
          </div>

          {/* Description */}
          <div className="px-6 py-8">
            <p className="text-gray-700 leading-relaxed text-lg">{constitution.description}</p>
          </div>

          {/* Key Info */}
          <div className="px-6 pb-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🥗 Diet Principle</h3>
              <p className="text-gray-600">{constitution.diet_principle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-medium text-green-800 text-sm mb-2">✅ Recommended Foods</h4>
                <div className="flex flex-wrap gap-2">
                  {constitution.recommended_foods.map((food, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white rounded-full text-xs text-green-700 border border-green-200">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-medium text-red-800 text-sm mb-2">❌ Avoid Foods</h4>
                <div className="flex flex-wrap gap-2">
                  {constitution.avoid_foods.map((food, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white rounded-full text-xs text-red-700 border border-red-200">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🏃 Exercise Recommendation</h3>
              <p className="text-gray-600">{constitution.exercise}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💡 Lifestyle Tips</h3>
              <ul className="space-y-2">
                {constitution.lifestyle_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {secondary && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">
                  You also show characteristics of{" "}
                  <span className="font-medium text-gray-700">{secondary.name_zh} ({secondary.name_en})</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-8 space-y-3">
            <Link
              href="/dashboard"
              className="block w-full text-center bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              View My Dashboard →
            </Link>
            <button
              onClick={handleShare}
              className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              📤 Share My Result
            </button>
            <Link
              href="/quiz"
              className="block w-full text-center text-gray-400 py-2 text-sm hover:text-gray-600 transition-colors"
            >
              Retake Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
