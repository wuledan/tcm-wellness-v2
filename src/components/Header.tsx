"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { getQuizResult } from "@/lib/utils";
import { useTranslation, type Locale } from "@/contexts/LanguageContext";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { data: session, status } = useSession();
  const { t, locale, setLocale } = useTranslation();
  const langRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = status === "authenticated";
  const hasResult = typeof window !== "undefined" && getQuizResult() !== null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t("header.nav.home"), show: true },
    { href: "/quiz", label: t("header.nav.quiz"), show: true },
    { href: "/dashboard", label: t("header.nav.dashboard"), show: hasResult },
    { href: "/food-scan", label: t("header.nav.foodScan"), show: true },
    { href: "/learn", label: t("header.nav.learn"), show: true },
    { href: "/daily", label: t("header.nav.daily"), show: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-serif text-xl font-bold text-gray-800">{t("header.logo")}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="text-sm text-gray-500 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {locales.find((l) => l.code === locale)?.label || "English"}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLocale(l.code); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        locale === l.code ? "text-emerald-700 font-medium bg-emerald-50" : "text-gray-700"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {session?.user?.name && (
                  <Link href="/profile" className="text-sm text-gray-500 hover:text-emerald-700 transition-colors">
                    {session.user.name}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  {t("header.auth.logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                {t("header.auth.signIn")}
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("common.toggleMenu")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.filter((l) => l.show).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile language selector */}
            <div className="px-3 py-2 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-2">Language</p>
              <div className="flex flex-wrap gap-1">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); setMobileOpen(false); }}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      locale === l.code
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            {isLoggedIn ? (
              <div className="px-3 py-2 space-y-2">
                {session?.user?.name && (
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-500">{session.user.name}</Link>
                )}
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="block text-sm text-red-400">{t("header.auth.logout")}</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("header.auth.signIn")}</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
