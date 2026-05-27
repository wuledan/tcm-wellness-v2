"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const stats = [
  { value: "9", label: "Body Types" },
  { value: "500+", label: "Food Mappings" },
  { value: "24", label: "Solar Terms" },
  { value: "AI", label: "Powered" },
];

const problems = [
  {
    icon: "🥗",
    title: "Western Doctors Don't Discuss Food",
    description: "Modern medicine rarely addresses how food affects your unique body. You get a prescription, not a food plan.",
  },
  {
    icon: "📱",
    title: "Diet Apps Don't Know You",
    description: "Generic calorie counting ignores your body type. What works for others may not work for YOUR constitution.",
  },
  {
    icon: "🔒",
    title: "2,000 Years of Wisdom, Locked Away",
    description: "TCM's personalized food wisdom is ancient, proven, and powerful — yet largely inaccessible in the West.",
  },
];

const steps = [
  { number: "01", title: "Know Your Body", description: "Take our 2-minute quiz to discover your TCM body type." },
  { number: "02", title: "Scan Your Food", description: "Snap a photo of any meal. AI analyzes its TCM properties for your body." },
  { number: "03", title: "Get Your Plan", description: "Receive personalized diet, exercise, and lifestyle recommendations." },
  { number: "04", title: "Track Progress", description: "Monitor changes and refine your wellness journey over time." },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              Ancient Wisdom × Modern AI
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Food as Medicine,{" "}
              <span className="text-emerald-600">Made Personal</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              TCM Wellness uses 2,000 years of Traditional Chinese Medicine wisdom — powered by AI — to give you personalized food, exercise, and lifestyle recommendations based on your unique body type.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                Discover Your Body Type
                <span>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3.5 rounded-full text-lg font-medium hover:bg-gray-50 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== PROBLEM SECTION ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Most Wellness Advice{" "}
              <span className="text-emerald-600">Doesn't Work for You</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The one-size-fits-all approach ignores a simple truth — every body is different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((p, i) => (
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
              Why TCM Food Therapy?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Two thousand years of personalized medicine meets modern AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Western Nutrition</h3>
              <ul className="space-y-4">
                {[
                  { icon: "📊", text: "Focuses on calories, macros, and standardized nutrients" },
                  { icon: "👤", text: "Same guidelines for everyone — one size fits all" },
                  { icon: "🧪", text: "Reductionist: food is broken down into isolated components" },
                  { icon: "🔄", text: "Treats symptoms after they appear" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span>{item.icon}</span>
                    <span className="text-gray-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="text-lg font-semibold text-emerald-800 mb-6 text-center">TCM Food Therapy</h3>
              <ul className="space-y-4">
                {[
                  { icon: "🔥", text: "Focuses on food nature (cold/cool/neutral/warm/hot) and your body type" },
                  { icon: "🧬", text: "Personalized: 9 body types, each with unique dietary needs" },
                  { icon: "🌿", text: "Holistic: food affects your entire system, energy, and balance" },
                  { icon: "🛡️", text: "Preventative: eat to maintain balance before illness arises" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span>{item.icon}</span>
                    <span className="text-emerald-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Food example card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-center font-medium text-gray-900 mb-6">Same food, different body types, different answers</h3>
            <p className="text-center text-gray-500 text-sm mb-6">同一食物，不同体质，不同答案</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { constitution: "阳虚质 (Yang Deficiency)", verdict: "✅ 适合", emoji: "❄️", color: "text-blue-600" },
                { constitution: "阴虚质 (Yin Deficiency)", verdict: "⚠️ 谨慎", emoji: "🔥", color: "text-red-600" },
                { constitution: "湿热质 (Damp-Heat)", verdict: "❌ 避免", emoji: "☀️", color: "text-amber-600" },
              ].map((item, i) => (
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
              How It Works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Your personalized wellness journey in four simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
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
            {stats.map((stat, i) => (
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
            Ready to Discover Your Body Type?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Take our 2-minute body constitution quiz and unlock personalized wellness recommendations based on your unique body type.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Start the Quiz
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
