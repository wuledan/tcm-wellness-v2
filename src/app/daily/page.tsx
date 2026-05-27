"use client";

import { useEffect, useState } from "react";
import { solarTerms, getCurrentSolarTerm, type SolarTerm } from "@/data/solarTerms";
import { getQuizResult } from "@/lib/utils";
import { constitutions } from "@/data/constitutions";

const dailyTips = [
  { day: 1, content: "Start your morning with a glass of warm water with lemon to gently awaken your digestive system." },
  { day: 2, content: "Try eating your largest meal at lunch when your digestive fire (Spleen Qi) is strongest, between 11am-1pm." },
  { day: 3, content: "Practice deep belly breathing for 5 minutes before meals to activate your parasympathetic nervous system." },
  { day: 4, content: "Chew each bite 20-30 times — digestion begins in the mouth. Your Spleen will thank you." },
  { day: 5, content: "Avoid iced drinks with meals. Cold liquids dampen digestive fire. Opt for warm tea or room temperature water." },
  { day: 6, content: "Take a 10-minute walk after lunch to support blood sugar balance and energy flow." },
  { day: 7, content: "Eat dinner at least 3 hours before bed to allow proper digestion before sleep." },
];

export default function DailyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const result = mounted ? getQuizResult() : null;
  const constitution = result ? constitutions.find((c) => c.id === result.primaryType) : null;
  const currentTerm = getCurrentSolarTerm();
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((today.getTime() - startOfYear) / 86400000);
  const tipIndex = dayOfYear % dailyTips.length;
  const currentTip = dailyTips[tipIndex];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">🌅 Daily Wellness</h1>
          <p className="text-gray-500">Your daily dose of TCM wisdom</p>
        </div>

        {/* Daily Tip */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Day {currentTip.day} of 7
            </span>
            <span className="text-sm text-gray-300">·</span>
            <span className="text-sm text-gray-400">
              {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Daily Wellness Tip</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{currentTip.content}</p>

          {constitution && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-700">
                <span className="font-medium">For your {constitution.name_en} body type: </span>
                {constitution.lifestyle_tips[tipIndex % constitution.lifestyle_tips.length]}
              </p>
            </div>
          )}
        </div>

        {/* Solar Term Guide */}
        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
              Current Solar Term
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-900 mb-1">
            🍃 {currentTerm.name_en} — {currentTerm.name_zh}
          </h2>
          <p className="text-amber-700 text-sm mb-2">{currentTerm.date}</p>
          <p className="text-amber-800 mb-4">{currentTerm.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-medium text-amber-800 text-sm mb-2">🥗 Dietary Advice</h3>
              <p className="text-amber-700 text-sm">{currentTerm.dietary_tip}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-medium text-amber-800 text-sm mb-2">🧘 Lifestyle Advice</h3>
              <p className="text-amber-700 text-sm">{currentTerm.lifestyle_tip}</p>
            </div>
          </div>
        </div>

        {/* Full Solar Term Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📅 24 Solar Terms Calendar</h2>
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
