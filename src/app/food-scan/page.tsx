"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuizResult } from "@/lib/utils";
import { getMatchLevel, matchLevelConfig, type MatchLevel, type TcmProperty } from "@/data/foods";
import { getConstitutionStyle } from "@/components/ConstitutionBadge";

interface AnalysisResult {
  foodName: string;
  calories: number;
  property: TcmProperty;
  propertyZh: string;
  matchLevel: MatchLevel;
  reason: string;
  alternativeName: string;
  alternativeProperty: TcmProperty;
  alternativeMatch: MatchLevel;
  alternativeReason: string;
}

const sampleResults: Record<string, AnalysisResult> = {
  default: {
    foodName: "红烧肉 (Braised Pork Belly)",
    calories: 550,
    property: "warm",
    propertyZh: "温",
    matchLevel: "avoid",
    reason: "肥甘厚味会加重体内湿热，导致口苦、便粘等症状加重。",
    alternativeName: "清蒸鱼 (Steamed Fish)",
    alternativeProperty: "neutral",
    alternativeMatch: "suitable",
    alternativeReason: "性平清淡，不增加湿热。",
  },
};

// Predefined food data for demo
const foodDB: Record<string, { name: string; calories: number; property: TcmProperty; propertyZh: string; category: string }> = {
  "红烧肉": { name: "红烧肉 (Braised Pork Belly)", calories: 550, property: "warm", propertyZh: "温", category: "肉类" },
  "沙拉": { name: "蔬菜沙拉 (Vegetable Salad)", calories: 120, property: "cool", propertyZh: "凉", category: "蔬菜" },
  "水果": { name: "时令水果 (Seasonal Fruit)", calories: 80, property: "cool", propertyZh: "凉", category: "水果" },
  "米饭": { name: "米饭 (Steamed Rice)", calories: 116, property: "neutral", propertyZh: "平", category: "谷物" },
  "面条": { name: "面条 (Noodles)", calories: 138, property: "neutral", propertyZh: "平", category: "谷物" },
  "鸡肉": { name: "鸡肉 (Chicken)", calories: 239, property: "warm", propertyZh: "温", category: "肉类" },
  "鱼": { name: "清蒸鱼 (Steamed Fish)", calories: 100, property: "neutral", propertyZh: "平", category: "海鲜" },
  "牛肉": { name: "牛肉 (Beef)", calories: 250, property: "warm", propertyZh: "温", category: "肉类" },
  "羊肉": { name: "羊肉 (Lamb)", calories: 294, property: "hot", propertyZh: "热", category: "肉类" },
  "豆腐": { name: "豆腐 (Tofu)", calories: 76, property: "cool", propertyZh: "凉", category: "大豆制品" },
  "西瓜": { name: "西瓜 (Watermelon)", calories: 30, property: "cold", propertyZh: "寒", category: "水果" },
  "姜茶": { name: "姜茶 (Ginger Tea)", calories: 30, property: "warm", propertyZh: "温", category: "饮品" },
  "咖啡": { name: "咖啡 (Coffee)", calories: 2, property: "warm", propertyZh: "温", category: "饮品" },
  "绿茶": { name: "绿茶 (Green Tea)", calories: 1, property: "cool", propertyZh: "凉", category: "饮品" },
};

const propertyColors: Record<TcmProperty, string> = {
  cold: "#4A90D9",
  cool: "#7EB8E8",
  neutral: "#80B080",
  warm: "#D4A040",
  hot: "#D95050",
};

const matchColor: Record<MatchLevel, string> = {
  suitable: "#22C55E",
  caution: "#EAB308",
  avoid: "#EF4444",
};

export default function FoodScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [manualFood, setManualFood] = useState("");
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("tcm_scan_count");
    if (stored) setScanCount(parseInt(stored));
  }, []);

  const constitutionResult = mounted ? getQuizResult() : null;
  const constitutionStyle = constitutionResult
    ? getConstitutionStyle(constitutionResult.primaryType)
    : null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      runAnalysis();
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      const demoResult = sampleResults.default;
      const primaryType = constitutionResult?.primaryType || "balanced";
      const match = getMatchLevel(primaryType, demoResult.property);

      const analysisResult: AnalysisResult = {
        ...demoResult,
        matchLevel: match,
        alternativeMatch: getMatchLevel(primaryType, demoResult.alternativeProperty),
      };

      setResult(analysisResult);
      setIsAnalyzing(false);
      const newCount = scanCount + 1;
      setScanCount(newCount);
      localStorage.setItem("tcm_scan_count", newCount.toString());
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualFood.trim()) return;
    const found = foodDB[manualFood.trim()];
    if (!found) {
      alert("Food not found in our database. Try a different name or upload a photo.");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const primaryType = constitutionResult?.primaryType || "balanced";
      const match = getMatchLevel(primaryType, found.property);

      const alternative = found.property === "warm" || found.property === "hot"
        ? foodDB["鱼"]
        : found.property === "cold" || found.property === "cool"
        ? foodDB["鸡肉"]
        : foodDB["豆腐"];

      const analysisResult: AnalysisResult = {
        foodName: found.name,
        calories: found.calories,
        property: found.property,
        propertyZh: found.propertyZh,
        matchLevel: match,
        reason: getReason(found.name, match),
        alternativeName: alternative.name,
        alternativeProperty: alternative.property,
        alternativeMatch: "suitable",
        alternativeReason: "性平清淡，适合你的体质。",
      };

      setResult(analysisResult);
      setIsAnalyzing(false);
      const newCount = scanCount + 1;
      setScanCount(newCount);
      localStorage.setItem("tcm_scan_count", newCount.toString());
    }, 1500);
  };

  const getReason = (foodName: string, match: MatchLevel): string => {
    if (match === "suitable") return `${foodName}的性质与你的体质平衡互补，可以放心食用。`;
    if (match === "caution") return `${foodName}的性质可能与你的体质有轻微冲突，少量食用无大碍，但不宜过量。`;
    return `${foodName}的性质与你的体质明显冲突，长期或大量食用可能加重体质偏性。`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">🍽️ Food Scanner</h1>
          <p className="text-gray-500">Snap a photo or type a food name to check its TCM compatibility</p>
        </div>

        {/* Scan count */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 text-sm text-gray-400">
            📸 Today&apos;s scans: {scanCount} / 3 (Free)
          </span>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
            >
              <span className="text-5xl block mb-4">📷</span>
              <p className="text-gray-700 font-medium mb-1">Take or upload a food photo</p>
              <p className="text-gray-400 text-sm">Click to select an image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img src={selectedImage} alt="Food" className="w-full rounded-xl max-h-64 object-cover" />
              <button
                onClick={() => { setSelectedImage(null); setResult(null); }}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* OR separator */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Manual food entry */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-3">🔍 Type a food name</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualFood}
              onChange={(e) => setManualFood(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              placeholder="e.g. 红烧肉, 西瓜, 姜茶..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
            />
            <button
              onClick={handleManualSearch}
              disabled={!manualFood.trim() || isAnalyzing}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? "..." : "Check"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.keys(foodDB).slice(0, 8).map((name) => (
              <button
                key={name}
                onClick={() => { setManualFood(name); }}
                className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="animate-spin text-4xl mb-4 inline-block">🔍</div>
            <p className="text-gray-700 font-medium">Analyzing your food...</p>
            <p className="text-gray-400 text-sm mt-1">Identifying ingredients and TCM properties</p>
          </div>
        )}

        {/* Result */}
        {result && !isAnalyzing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Food info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{result.foodName}</h2>
                  <p className="text-sm text-gray-400">≈{result.calories}kcal per serving</p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: propertyColors[result.property] + "20", color: propertyColors[result.property] }}
                >
                  性{result.propertyZh}
                </span>
              </div>

              {/* Match level */}
              <div
                className="rounded-xl p-4 border"
                style={{ backgroundColor: matchColor[result.matchLevel] + "10", borderColor: matchColor[result.matchLevel] + "30" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: matchColor[result.matchLevel] }}>
                    {matchLevelConfig[result.matchLevel].emoji}
                  </span>
                  <span className="font-semibold" style={{ color: matchColor[result.matchLevel] }}>
                    {matchLevelConfig[result.matchLevel].label_zh} &mdash; Not Recommended for Your Body Type
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.reason}</p>
              </div>
            </div>

            {/* Alternative */}
            <div className="p-6 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-medium text-sm">💡 Alternative Suggestion</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{result.alternativeName}</p>
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs mt-1"
                    style={{ backgroundColor: propertyColors[result.alternativeProperty] + "20", color: propertyColors[result.alternativeProperty] }}
                  >
                    性{result.alternativeProperty === "neutral" ? "平" : result.alternativeProperty === "cool" ? "凉" : result.alternativeProperty === "cold" ? "寒" : result.alternativeProperty === "warm" ? "温" : "热"}
                  </span>
                  <span className="ml-2 text-green-600 text-sm">{matchLevelConfig[result.alternativeMatch].emoji} {matchLevelConfig[result.alternativeMatch].label_zh}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{result.alternativeReason}</p>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-2">
              <button
                onClick={() => { setSelectedImage(null); setResult(null); setManualFood(""); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Scan Another
              </button>
              <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                🤖 Ask AI: Today&apos;s Lunch
              </button>
            </div>
          </div>
        )}

        {/* Info tip */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            ⚕️ Food analysis is for educational purposes only. Not medical advice.
            Results are simulated for MVP demo. In production, AI vision analysis provides real-time identification.
          </p>
        </div>
      </div>
    </div>
  );
}
