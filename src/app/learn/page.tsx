"use client";

import { useState } from "react";
import { constitutions } from "@/data/constitutions";
import { useTranslation } from "@/contexts/LanguageContext";

export default function LearnPage() {
  const [selectedConstitution, setSelectedConstitution] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();

  const toggleCard = (key: string) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = t("learn.categories");
  const parsedCategories = typeof categories === "string" ? [] : categories as any[];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            📖 {t("learn.title")}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t("learn.subtitle")}
          </p>
        </div>

        {/* Constitution quick reference */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("learn.quickRef")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {constitutions.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConstitution(selectedConstitution === c.id ? null : c.id)}
                className={`p-3 rounded-xl text-center border transition-all ${
                  selectedConstitution === c.id
                    ? "border-emerald-400 bg-emerald-50 shadow-sm"
                    : "border-gray-100 bg-white hover:shadow-sm"
                }`}
              >
                <span className="text-2xl block mb-1">{c.emoji}</span>
                <span className="text-xs font-medium text-gray-700 block">{c.name_en}</span>
                <span className="text-[10px] text-gray-400">{c.name_zh}</span>
              </button>
            ))}
          </div>

          {selectedConstitution && (
            <div className="mt-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              {(() => {
                const c = constitutions.find((x) => x.id === selectedConstitution);
                if (!c) return null;
                return (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {c.emoji} {c.name_en} ({c.name_zh})
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{c.description}</p>
                    <p className="text-sm text-emerald-700 font-medium">{c.diet_principle}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </section>

        {/* Article categories */}
        {parsedCategories.map((section: any, si: number) => {
          const colors = ["emerald", "amber", "blue"];
          return (
            <section key={si} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{section.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{section.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(section.articles || []).map((article: any, i: number) => {
                  const cardKey = `${si}-${i}`;
                  const isExpanded = expandedCards[cardKey];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleCard(cardKey)}
                      className="w-full text-left bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <span className="text-2xl block mb-3">{article.icon}</span>
                      <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-500">{article.summary}</p>
                      {isExpanded && article.detail && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 leading-relaxed">{article.detail}</p>
                        </div>
                      )}
                      <span className="inline-block mt-3 text-xs font-medium text-emerald-600">
                        {isExpanded ? t("learn.showLess") : t("learn.readMore")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            {t("learn.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
