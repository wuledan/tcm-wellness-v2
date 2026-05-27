"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const stats = t("home.stats");
  const parsedStats = typeof stats === "string" ? [] : stats as any[];

  const problems = t("home.problems");
  const parsedProblems = typeof problems === "string" ? [] : problems as any[];

  const steps = t("home.steps");
  const parsedSteps = typeof steps === "string" ? [] : steps as any[];

  const westernItems = t("home.westernItems");
  const parsedWestern = typeof westernItems === "string" ? [] : westernItems as string[];

  const tcmItems = t("home.tcmItems");
  const parsedTcm = typeof tcmItems === "string" ? [] : tcmItems as string[];

  const foodExamples = t("home.foodExampleItems");
  const parsedFoodExamples = typeof foodExamples === "string" ? [] : foodExamples as any[];

  const heroTitle = t("home.heroTitle");
  const heroParts = heroTitle.split("{highlight}");
  const problemTitle = t("home.problemTitle");
  const problemParts = problemTitle.split("{highlight}");

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              {t("home.badge")}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {heroParts[0]}
              <span className="text-emerald-600">{heroParts[1]}</span>
              {heroParts[2]}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("home.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                {t("home.ctaQuiz")}
                <span>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3.5 rounded-full text-lg font-medium hover:bg-gray-50 transition-all"
              >
                {t("home.ctaLearnMore")}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== PROBLEM SECTION ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {problemParts[0]}
              <span className="text-emerald-600">{problemParts[1]}</span>
              {problemParts[2]}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {t("home.problemSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parsedProblems.map((p: any, i: number) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl block mb-4">{p.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY TCM SECTION ========== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("home.whyTcmTitle")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {t("home.whyTcmSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">{t("home.westernTitle")}</h3>
              <ul className="space-y-4">
                {parsedWestern.map((item: string, i: number) => {
                  const icons = ["📊", "👤", "🧪", "🔄"];
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span>{icons[i]}</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="text-lg font-semibold text-emerald-800 mb-6 text-center">{t("home.tcmTitle")}</h3>
              <ul className="space-y-4">
                {parsedTcm.map((item: string, i: number) => {
                  const icons = ["🔥", "🧬", "🌿", "🛡️"];
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span>{icons[i]}</span>
                      <span className="text-emerald-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Food example card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-center font-medium text-gray-900 mb-6">{t("home.foodExampleTitle")}</h3>
            <p className="text-center text-gray-500 text-sm mb-6">{t("home.foodExampleSubtitle")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {parsedFoodExamples.map((item: any, i: number) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <p className="text-xs text-gray-500 mb-1">Ginger Tea</p>
                  <p className="text-sm font-medium text-gray-800 mb-1">{item.constitution}</p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("home.howItWorksTitle")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {parsedSteps.map((step: any, i: number) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {parsedStats.map((stat: any, i: number) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-emerald-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            {t("home.ctaText")}
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            {t("home.ctaButton")}
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
