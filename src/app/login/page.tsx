"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await signIn("credentials", {
      email: email.trim(),
      name: name.trim() || email.trim().split("@")[0],
      callbackUrl,
    });
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("login.namePlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
            />
            <p className="text-xs text-gray-400 mt-1">{t("login.emailHint")}</p>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            {t("login.submitButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🌿</span>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{t("login.title")}</h1>
          <p className="text-gray-500">{t("login.subtitle")}</p>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400">{t("login.loading")}</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
