"use client";

import { useTranslation } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-lg font-bold text-gray-800">{t("header.logo")}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-3">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/quiz" className="hover:text-emerald-600 transition-colors">{t("footer.links.bodyTypeQuiz")}</a></li>
              <li><a href="/food-scan" className="hover:text-emerald-600 transition-colors">{t("footer.links.foodScanner")}</a></li>
              <li><a href="/learn" className="hover:text-emerald-600 transition-colors">{t("footer.links.learnTcm")}</a></li>
              <li><a href="/daily" className="hover:text-emerald-600 transition-colors">{t("footer.links.dailyWellness")}</a></li>
              <li><a href="/about" className="hover:text-emerald-600 transition-colors">{t("footer.links.aboutUs")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-3">{t("footer.legal")}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t("footer.legalText")}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-400">
            {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  );
}
