"use client";

import { useEffect, useState } from "react";
import { solarTerms, getCurrentSolarTerm, type SolarTerm } from "@/data/solarTerms";
import { getQuizResult } from "@/lib/utils";
import { constitutions } from "@/data/constitutions";
import { useTranslation } from "@/contexts/LanguageContext";

export default function DailyPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => { setMounted(true); }, []);

  const tips = t("daily.tips");
  const parsedTips = typeof tips === "string" ? [] : tips as string[];

  const result = mounted ? getQuizResult() : null;
  const constitution = result ? constitutions.find((c) => c.id === result.primaryType) : null;
  const currentTerm = getCurrentSolarTerm();
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((today.getTime() - startOfYear) / 86400000);
  const tipIndex = dayOfYear % parsedTips.length;
  const currentTip = parsedTips[tipIndex] || "";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">🌅 {t("daily.title")}</h1>
          <p className="text-gray-500">{t("daily.subtitle")}</p>
        </div>

        {/* Daily Tip */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {t("daily.dayOf").replace("{day}", String(tipIndex + 1))}
            </span>
            <span className="text-sm text-gray-300">·</span>
            <span className="text-sm text-gray-400">
              {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{t("daily.tipTitle")}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{currentTip}</p>

          {constitution && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-700">
                <span className="font-medium">{t("daily.forYourBodyType").replace("{name}", constitution.name_en)}</span>
                {constitution.lifestyle_tips[tipIndex % constitution.lifestyle_tips.length]}
              </p>
            </div>
          )}
        </div>

        {/* Solar Term Guide */}
        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
              {t("daily.solarTerm.currentLabel")}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-900 mb-1">
            🍃 {currentTerm.name_en} — {currentTerm.name_zh}
          </h2>
          <p className="text-amber-700 text-sm mb-2">{currentTerm.date}</p>
          <p className="text-amber-800 mb-4">{currentTerm.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-medium text-amber-800 text-sm mb-2">{t("daily.solarTerm.dietaryAdvice")}</h3>
              <p className="text-amber-700 text-sm">{currentTerm.dietary_tip}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-medium text-amber-800 text-sm mb-2">{t("daily.solarTerm.lifestyleAdvice")}</h3>
              <p className="text-amber-700 text-sm">{currentTerm.lifestyle_tip}</p>
            </div>
          </div>
        </div>

        {/* Full Solar Term Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">{t("daily.solarTerm.calendarTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {solarTerms.map((term) => (
              <div
                key={term.id}
                className={`p-3 rounded-lg text-center text-sm border transition-colors ${
                  currentTerm.id === term.id
                    ? "bg-amber-50 border-amber-300"
                    : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-xs text-gray-400 block">{term.date}</span>
                <span className={`font-medium ${currentTerm.id === term.id ? "text-amber-800" : "text-gray-700"}`}>
                  {term.name_en}
                </span>
                <span className="text-[10px] text-gray-400 block">{term.name_zh}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
