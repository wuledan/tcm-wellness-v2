"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { constitutions } from "@/data/constitutions";
import { getCurrentSolarTerm } from "@/data/solarTerms";
import { getQuizResult } from "@/lib/utils";

interface AiMeal {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  foods: string[];
}

interface AiExercise {
  name: string;
  name_zh: string;
  duration: string;
  description: string;
  description_zh: string;
}

interface AiTip {
  tip_en: string;
  tip_zh: string;
}

interface AiRecommendations {
  meals: {
    breakfast: AiMeal;
    lunch: AiMeal;
    dinner: AiMeal;
  };
  exercise: AiExercise;
  lifestyle_tips: AiTip[];
}

interface MealPlan {
  time: string;
  icon: string;
  name: string;
  foods: string[];
  tip: string;
}

const seasons = ["Spring", "Summer", "Late Summer", "Autumn", "Winter"];

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getQuizResult>>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendations | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const r = getQuizResult();
    if (!r) {
      router.push("/quiz");
      return;
    }
    setResult(r);
  }, [router]);

  useEffect(() => {
    if (!result) return;
    const constitution = constitutions.find((c) => c.id === result.primaryType);
    if (!constitution) return;

    const fetchRecommendations = async () => {
      setAiLoading(true);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            constitutionType: constitution.id,
            constitutionName: constitution.name_en,
            season: getSeason(),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiRecommendations(data);
        }
      } catch {
        // API unavailable — fall through to static data
      } finally {
        setAiLoading(false);
      }
    };

    fetchRecommendations();
  }, [result]);

  if (!mounted || !result) return null;

  const constitution = constitutions.find((c) => c.id === result.primaryType);
  if (!constitution) return null;

  const solarTerm = getCurrentSolarTerm();

  const meals: MealPlan[] = [
    {
      time: "Breakfast",
      icon: "🌅",
      name: aiRecommendations?.meals.breakfast.name || "Warm Nourishing Breakfast",
      foods: aiRecommendations?.meals.breakfast.foods || constitution.recommended_foods.slice(0, 3),
      tip: aiRecommendations?.meals.breakfast.description || "Start your day with warm, easily digestible foods",
    },
    {
      time: "Lunch",
      icon: "☀️",
      name: aiRecommendations?.meals.lunch.name || "Balanced Midday Meal",
      foods: aiRecommendations?.meals.lunch.foods || constitution.recommended_foods.slice(2, 5),
      tip: aiRecommendations?.meals.lunch.description || "Include a protein, complex carb, and cooked vegetables",
    },
    {
      time: "Dinner",
      icon: "🌙",
      name: aiRecommendations?.meals.dinner.name || "Light Evening Meal",
      foods: aiRecommendations?.meals.dinner.foods || constitution.recommended_foods.slice(1, 4),
      tip: aiRecommendations?.meals.dinner.description || "Eat dinner early and keep it light for better sleep",
    },
  ];

  const mealNamesZh: Record<string, string> = {
    "Warm Nourishing Breakfast": "温补早餐",
    "Balanced Midday Meal": "均衡午餐",
    "Light Evening Meal": "清淡晚餐",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{constitution.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {constitution.name_en} · {constitution.name_zh}
                </h1>
                <p className="text-gray-400 text-sm">Your Personalized Wellness Dashboard</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              🍃 {solarTerm.name_en} — {solarTerm.name_zh}
            </span>
          </div>
        </div>

        {/* Today's Food Recommendations */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🥗 Today&apos;s Meal Suggestions</h2>
          {aiLoading && (
            <p className="text-sm text-gray-400 mb-3">✨ AI is personalizing your recommendations...</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meals.map((meal, i) => {
              const mealNameZh = aiRecommendations
                ? [aiRecommendations.meals.breakfast, aiRecommendations.meals.lunch, aiRecommendations.meals.dinner][i]?.name_zh
                : mealNamesZh[meal.name] || "";
              const mealDescZh = aiRecommendations
                ? [aiRecommendations.meals.breakfast, aiRecommendations.meals.lunch, aiRecommendations.meals.dinner][i]?.description_zh
                : "";
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{meal.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{meal.time}</p>
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      {mealNameZh && (
                        <p className="text-xs text-gray-400">{mealNameZh}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {meal.foods.map((food, j) => (
                      <span key={j} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                        {food}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{meal.tip}</p>
                  {mealDescZh && (
                    <p className="text-xs text-gray-400 mt-0.5">{mealDescZh}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link href="/food-scan" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              🔍 Scan a food to check if it&apos;s right for you →
            </Link>
          </div>
        </section>

        {/* Exercise & Lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Exercise */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">🏃 Today&apos;s Exercise</h3>
            {aiRecommendations ? (
              <>
                <p className="font-medium text-gray-900">{aiRecommendations.exercise.name}</p>
                <p className="text-xs text-gray-400 mb-2">{aiRecommendations.exercise.name_zh}</p>
                <p className="text-sm text-gray-500 mb-2">{aiRecommendations.exercise.duration}</p>
                <p className="text-gray-600 mb-3">{aiRecommendations.exercise.description}</p>
                <p className="text-xs text-gray-400 mb-3">{aiRecommendations.exercise.description_zh}</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-3">{constitution.exercise}</p>
              </>
            )}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Frequency:</span> 30-45 minutes, 4-5 times per week
              </p>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Lifestyle Tips</h3>
            {aiRecommendations ? (
              <ul className="space-y-2">
                {aiRecommendations.lifestyle_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <div>
                      <span>{tip.tip_en}</span>
                      <p className="text-xs text-gray-400">{tip.tip_zh}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {constitution.lifestyle_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Solar Term Tip */}
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm mb-6">
          <h3 className="font-semibold text-amber-800 mb-2">
            🍃 {solarTerm.name_en} — {solarTerm.name_zh} Wellness Guide
          </h3>
          <p className="text-amber-700 text-sm mb-3">{solarTerm.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <span className="font-medium text-amber-800">Diet: </span>
              <span className="text-amber-700">{solarTerm.dietary_tip}</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="font-medium text-amber-800">Lifestyle: </span>
              <span className="text-amber-700">{solarTerm.lifestyle_tip}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/food-scan", icon: "📷", label: "Food Scan" },
            { href: "/learn", icon: "📖", label: "Learn" },
            { href: "/daily", icon: "🌅", label: "Daily Tips" },
            { href: "/profile", icon: "👤", label: "My Profile" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <span className="text-2xl block mb-1">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
