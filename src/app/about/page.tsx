"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useTranslation();

  const stage1Items = t("about.stage1Items");
  const parsedStage1 = typeof stage1Items === "string" ? [] : stage1Items as any[];

  const stage3Items = t("about.stage3Items");
  const parsedStage3 = typeof stage3Items === "string" ? [] : stage3Items as any[];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-5xl block mb-6">🌿</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t("about.heroTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("about.heroText")}
          </p>
        </div>
      </section>

      {/* Three-stage narrative */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Stage 1: Problem */}
          <div className="mb-16">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t("about.stage1Label")}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              {t("about.stage1Title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {parsedStage1.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 2: Why western approach falls short */}
          <div className="mb-16">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t("about.stage2Label")}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              {t("about.stage2Title")}
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("about.stage2Text1")}
              </p>
              <p className="text-emerald-700 font-serif text-xl font-semibold text-center py-4">
                {t("about.stage2Quote")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t("about.stage2Text2")}
              </p>
            </div>
          </div>

          {/* Stage 3: Solution */}
          <div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t("about.stage3Label")}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              {t("about.stage3Title")}
            </h2>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <p className="text-emerald-800 leading-relaxed mb-4">
                {t("about.stage3Text1")}
              </p>
              <p className="text-emerald-800 leading-relaxed mb-6">
                {t("about.stage3Text2")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parsedStage3.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-emerald-800 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-gray-500 mb-8">
            {t("about.ctaText")}
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            {t("about.ctaButton")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
