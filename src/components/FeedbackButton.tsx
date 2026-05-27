"use client";

import { useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm font-medium"
        aria-label={t("feedback.button")}
      >
        <span aria-hidden="true">💬</span>
        <span className="hidden sm:inline">{t("feedback.button").replace("💬 ", "")}</span>
      </button>
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
