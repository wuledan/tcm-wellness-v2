"use client";

import { useState } from "react";
import { constitutions } from "@/data/constitutions";

const articles = [
  {
    category: "体质科普",
    category_en: "Body Constitution",
    color: "emerald",
    items: [
      {
        title: "Understanding the 9 Body Types in TCM",
        summary: "An overview of the nine constitution types and what they mean for your health.",
        icon: "🧬",
      },
      {
        title: "气虚质 (Qi Deficiency) — When Your Battery is Low",
        summary: "Signs, causes, and dietary strategies for Qi deficiency.",
        icon: "💨",
      },
      {
        title: "阳虚质 (Yang Deficiency) — The Cold Body Type",
        summary: "Why you feel cold all the time and how to warm up from within.",
        icon: "❄️",
      },
      {
        title: "阴虚质 (Yin Deficiency) — The Heat Inside",
        summary: "Understanding internal heat and how to cool and nourish your body.",
        icon: "🔥",
      },
    ],
  },
  {
    category: "常见症状解读",
    category_en: "Symptom Insights",
    color: "amber",
    items: [
      {
        title: "Brain Fog: A TCM Perspective",
        summary: "TCM views brain fog as a Spleen Qi deficiency. Learn how diet affects mental clarity.",
        icon: "🧠",
      },
      {
        title: "Afternoon Fatigue & The Body Clock",
        summary: "Why you crash at 2 PM according to the TCM organ clock.",
        icon: "⏰",
      },
      {
        title: "Understanding Bloating from a TCM View",
        summary: "Bloating is often Spleen Qi stagnation. Discover which foods help.",
        icon: "🫧",
      },
      {
        title: "Insomnia: Finding Your Sleep Type",
        summary: "Different sleep issues point to different organ imbalances in TCM.",
        icon: "🌙",
      },
    ],
  },
  {
    category: "中西医对照",
    category_en: "East Meets West",
    color: "blue",
    items: [
      {
        title: "TCM vs. Western Nutrition: A Comparison",
        summary: "How two medical paradigms approach food and health differently.",
        icon: "🔄",
      },
      {
        title: "The Spleen in TCM vs. Western Medicine",
        summary: "The TCM Spleen is not the same organ — here&apos;s what it really means.",
        icon: "🔬",
      },
      {
        title: "Inflammation: A TCM and Western View",
        summary: "Western anti-inflammatory meets TCM heat-clearing approaches.",
        icon: "🔥",
      },
      {
        title: "Gut Health: One Concept, Two Paradigms",
        summary: "How TCM Spleen-Stomach theory aligns with modern microbiome research.",
        icon: "🦠",
      },
    ],
  },
];

export default function LearnPage() {
  const [selectedConstitution, setSelectedConstitution] = useState<string | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            📖 Learn TCM Wellness
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore the wisdom of Traditional Chinese Medicine — from body constitution types to dietary therapy and beyond.
          </p>
        </div>

        {/* Constitution quick reference */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Reference: Body Types</h2>
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
        {articles.map((section) => (
          <section key={section.category} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{section.category_en}</h2>
            <p className="text-sm text-gray-400 mb-4">{section.category}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((article, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className="text-2xl block mb-3">{article.icon}</span>
                  <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500">{article.summary}</p>
                  <span className="inline-block mt-3 text-xs font-medium" style={{ color: `var(--color-${section.color}-600)` }}>
                    Read more →
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            ⚕️ All content is for educational purposes only. Not medical advice.
            Consult a qualified TCM practitioner or healthcare provider for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
