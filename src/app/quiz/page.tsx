"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, calculateQuizResult } from "@/data/quiz";
import { storeQuizResult } from "@/lib/utils";

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = quizQuestions[currentQuestion];
  const totalQuestions = quizQuestions.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleNext = async () => {
    if (!selected) return;

    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected(null);
    } else {
      setIsSubmitting(true);
      try {
        const formattedAnswers = Object.entries(newAnswers).map(([qId, value]) => {
          const q = quizQuestions.find((q) => q.id === parseInt(qId));
          const opt = q?.options.find((o) => o.value === value);
          return {
            question_id: parseInt(qId),
            question_en: q?.question_en || "",
            answer_en: opt?.label_en || "",
            constitution_value: value,
          };
        });

        const res = await fetch("/api/quiz/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers }),
        });

        if (res.ok) {
          const aiResult = await res.json();
          storeQuizResult({
            primaryType: aiResult.primary_type || "balanced",
            secondaryType: aiResult.secondary_type || null,
            scores: {},
          });
          router.push("/quiz/result");
          return;
        }
      } catch {
        // API unavailable — fall through to local calculation
      }

      const result = calculateQuizResult(newAnswers);
      storeQuizResult(result);
      router.push("/quiz/result");
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-6 inline-block">🔮</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Responses...</h2>
          <p className="text-gray-400">Consulting ancient TCM wisdom with modern AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress / (100 / totalQuestions))}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="text-5xl mb-6 text-center">{question.emoji}</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-2">
            {question.question_en}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8 italic">
            {question.question}
          </p>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected === option.value
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-gray-900">{option.label_en}</div>
                <div className="text-sm text-gray-400 mt-0.5">{option.label}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            className={`mt-8 w-full py-3.5 rounded-xl text-white font-medium text-lg transition-all ${
              selected
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            {currentQuestion < totalQuestions - 1 ? "Next →" : "See My Results →"}
          </button>
        </div>
      </div>
    </div>
  );
}
