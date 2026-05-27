"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { constitutions } from "@/data/constitutions";
import { getQuizResult, storeBodyData, getBodyData, clearQuizResult } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getQuizResult>>(null);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    exercise: "",
    sleep: "",
  });
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();

  const fields = t("profile.fields");
  const parsedFields = typeof fields === "string" ? {} : fields as Record<string, string>;

  const links = t("profile.links");
  const parsedLinks = typeof links === "string" ? [] : links as any[];

  useEffect(() => {
    setMounted(true);
    const r = getQuizResult();
    setResult(r);
    const bodyData = getBodyData();
    if (bodyData) {
      setFormData((prev) => ({ ...prev, ...bodyData }));
    }
  }, []);

  const constitution = result ? constitutions.find((c) => c.id === result.primaryType) : null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    storeBodyData(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRetakeQuiz = () => {
    clearQuizResult();
    router.push("/quiz");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8 text-center">👤 {t("profile.title")}</h1>

        {/* Constitution Info */}
        {constitution && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{constitution.emoji}</span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {constitution.name_en} · {constitution.name_zh}
                </h2>
                <p className="text-sm text-gray-400">{t("profile.primaryLabel")}</p>
              </div>
              <button
                onClick={handleRetakeQuiz}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t("profile.retakeQuiz")}
              </button>
            </div>
          </div>
        )}

        {/* Body Data Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("profile.bodyData")}</h2>
          <p className="text-sm text-gray-400 mb-6">
            {t("profile.bodyDataHint")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.height || "Height (cm)"}</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                placeholder={parsedFields.heightPlaceholder || "e.g. 168"}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.weight || "Weight (kg)"}</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                placeholder={parsedFields.weightPlaceholder || "e.g. 62"}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.age || "Age"}</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder={parsedFields.agePlaceholder || "e.g. 32"}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.gender || "Gender"}</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-white"
              >
                <option value="">{parsedFields.genderPlaceholder || "Select"}</option>
                <option value="male">{parsedFields.genderMale || "Male"}</option>
                <option value="female">{parsedFields.genderFemale || "Female"}</option>
                <option value="other">{parsedFields.genderOther || "Other"}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.exercise || "Exercise Frequency"}</label>
              <select
                value={formData.exercise}
                onChange={(e) => handleChange("exercise", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-white"
              >
                <option value="">{parsedFields.exercisePlaceholder || "Select"}</option>
                <option value="rarely">{parsedFields.exerciseRarely || "几乎不 (Rarely)"}</option>
                <option value="1-2">{parsedFields.exercise1to2 || "每周1-2次 (1-2/week)"}</option>
                <option value="3-5">{parsedFields.exercise3to5 || "每周3-5次 (3-5/week)"}</option>
                <option value="daily">{parsedFields.exerciseDaily || "每天 (Daily)"}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{parsedFields.sleep || "Sleep Duration"}</label>
              <select
                value={formData.sleep}
                onChange={(e) => handleChange("sleep", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-white"
              >
                <option value="">{parsedFields.sleepPlaceholder || "Select"}</option>
                <option value="<5">{parsedFields.sleepLess5 || "少于5小时 (<5h)"}</option>
                <option value="5-6">{parsedFields.sleep5to6 || "5-6小时"}</option>
                <option value="7-8">{parsedFields.sleep7to8 || "7-8小时"}</option>
                <option value=">8">{parsedFields.sleepMore8 || "多于8小时 (>8h)"}</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              saved
                ? "bg-green-100 text-green-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {saved ? t("profile.savedButton") : t("profile.saveButton")}
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("profile.quickLinks")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/dashboard", icon: "🏠" },
              { href: "/food-scan", icon: "📷" },
              { href: "/daily", icon: "🌅" },
              { href: "/learn", icon: "📖" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium text-gray-700 text-sm">{parsedLinks[i]?.label || ""}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
