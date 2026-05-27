"use client";

import Link from "next/link";
import { useState } from "react";
import { getQuizResult } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasResult = typeof window !== "undefined" && getQuizResult() !== null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-serif text-xl font-bold text-gray-800">TCM Wellness</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Home</Link>
            <Link href="/quiz" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Body Quiz</Link>
            {hasResult && <Link href="/dashboard" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Dashboard</Link>}
            <Link href="/food-scan" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Food Scan</Link>
            <Link href="/learn" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Learn</Link>
            <Link href="/daily" className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">Daily</Link>
            <Link
              href="/quiz"
              className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Start Quiz
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link href="/quiz" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Body Quiz</Link>
            {hasResult && <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>}
            <Link href="/food-scan" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Food Scan</Link>
            <Link href="/learn" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Learn</Link>
            <Link href="/daily" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Daily</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
