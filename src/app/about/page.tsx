import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-5xl block mb-6">🌿</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Are you struggling with brain fog, afternoon fatigue, and unexplained weight gain?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            You&apos;ve tried every diet, every wellness trend — but the results are always temporary.
            What if the answer isn&apos;t a new diet, but an ancient wisdom that sees your body as unique?
          </p>
        </div>
      </section>

      {/* Three-stage narrative */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Stage 1: Problem */}
          <div className="mb-16">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Stage 1 · The Problem</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              Modern Life, Modern Problems
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: "🧠", title: "Brain Fog", desc: "Can&apos;t focus by 2 PM? Your digestion might be pulling energy from your brain." },
                { icon: "😴", title: "Afternoon Fatigue", desc: "Feeling drained after lunch? Your body is struggling to process what you ate." },
                { icon: "⚖️", title: "Weight Struggles", desc: "Every diet works for others but not for you? Your body type needs a different approach." },
              ].map((item, i) => (
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
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Stage 2 · Why Western Methods Fall Short</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              Tried every method but results are temporary?
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                Modern wellness treats symptoms, not root causes. It prescribes the same solution for everyone —
                counting calories, cutting carbs, eating less — without asking the most important question:
              </p>
              <p className="text-emerald-700 font-serif text-xl font-semibold text-center py-4">
                &ldquo;What is YOUR body type?&rdquo;
              </p>
              <p className="text-gray-700 leading-relaxed">
                Western nutrition sees food as numbers. TCM sees food as energy — warming or cooling,
                nourishing or draining — that interacts differently with every unique body.
              </p>
            </div>
          </div>

          {/* Stage 3: Solution */}
          <div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Stage 3 · The Solution</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">
              Let&apos;s try 2,000 years of accumulated Chinese wisdom — for your body, uniquely.
            </h2>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <p className="text-emerald-800 leading-relaxed mb-4">
                TCM (Traditional Chinese Medicine) has been personalized medicine for over two millennia.
                Its core insight is simple but profound: every person has a unique body constitution, and
                what heals one person may harm another.
              </p>
              <p className="text-emerald-800 leading-relaxed mb-6">
                Our AI-powered platform brings this ancient wisdom to your fingertips:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "🧬", text: "Discover your unique TCM body type in 2 minutes" },
                  { icon: "📸", text: "Scan any food to see if it&apos;s right for YOUR body" },
                  { icon: "🥗", text: "Get personalized meal, exercise, and lifestyle plans" },
                  { icon: "🌍", text: "Available in English and Chinese" },
                ].map((item, i) => (
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
            Ready to understand your body?
          </h2>
          <p className="text-gray-500 mb-8">
            2,000 years of wisdom. 2 minutes of your time. A lifetime of better wellness.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Discover Your Body Type →
          </Link>
        </div>
      </section>
    </div>
  );
}
