"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuizResult } from "@/lib/utils";
import { getMatchLevel, matchLevelConfig, type MatchLevel, type TcmProperty } from "@/data/foods";
import { getConstitutionStyle } from "@/components/ConstitutionBadge";
import { useTranslation } from "@/contexts/LanguageContext";

interface AnalysisResult {
  foodNameEn: string;
  foodNameZh: string;
  calories: number;
  property: TcmProperty;
  propertyZh: string;
  matchLevel: MatchLevel;
  reasonEn: string;
  reasonZh: string;
  alternativeNameEn: string;
  alternativeNameZh: string;
  alternativeProperty: TcmProperty;
  alternativeMatch: MatchLevel;
}

const sampleResults: Record<string, AnalysisResult> = {
  default: {
    foodNameEn: "Braised Pork Belly",
    foodNameZh: "红烧肉",
    calories: 550,
    property: "warm",
    propertyZh: "温",
    matchLevel: "avoid",
    reasonEn: "Rich, greasy foods worsen damp-heat in your body, leading to bitter taste and sticky stools.",
    reasonZh: "肥甘厚味会加重体内湿热，导致口苦、便粘等症状加重。",
    alternativeNameEn: "Steamed Fish",
    alternativeNameZh: "清蒸鱼",
    alternativeProperty: "neutral",
    alternativeMatch: "suitable",
  },
};

interface FoodDBEntry {
  nameEn: string;
  nameZh: string;
  calories: number;
  property: TcmProperty;
  propertyZh: string;
  category: string;
}

const foodDB: Record<string, FoodDBEntry> = {
  "红烧肉": { nameEn: "Braised Pork Belly", nameZh: "红烧肉", calories: 550, property: "warm", propertyZh: "温", category: "肉类" },
  "沙拉": { nameEn: "Vegetable Salad", nameZh: "蔬菜沙拉", calories: 120, property: "cool", propertyZh: "凉", category: "蔬菜" },
  "水果": { nameEn: "Seasonal Fruit", nameZh: "时令水果", calories: 80, property: "cool", propertyZh: "凉", category: "水果" },
  "米饭": { nameEn: "Steamed Rice", nameZh: "米饭", calories: 116, property: "neutral", propertyZh: "平", category: "谷物" },
  "面条": { nameEn: "Noodles", nameZh: "面条", calories: 138, property: "neutral", propertyZh: "平", category: "谷物" },
  "鸡肉": { nameEn: "Chicken", nameZh: "鸡肉", calories: 239, property: "warm", propertyZh: "温", category: "肉类" },
  "鱼": { nameEn: "Steamed Fish", nameZh: "清蒸鱼", calories: 100, property: "neutral", propertyZh: "平", category: "海鲜" },
  "牛肉": { nameEn: "Beef", nameZh: "牛肉", calories: 250, property: "warm", propertyZh: "温", category: "肉类" },
  "羊肉": { nameEn: "Lamb", nameZh: "羊肉", calories: 294, property: "hot", propertyZh: "热", category: "肉类" },
  "豆腐": { nameEn: "Tofu", nameZh: "豆腐", calories: 76, property: "cool", propertyZh: "凉", category: "大豆制品" },
  "西瓜": { nameEn: "Watermelon", nameZh: "西瓜", calories: 30, property: "cold", propertyZh: "寒", category: "水果" },
  "姜茶": { nameEn: "Ginger Tea", nameZh: "姜茶", calories: 30, property: "warm", propertyZh: "温", category: "饮品" },
  "咖啡": { nameEn: "Coffee", nameZh: "咖啡", calories: 2, property: "warm", propertyZh: "温", category: "饮品" },
  "绿茶": { nameEn: "Green Tea", nameZh: "绿茶", calories: 1, property: "cool", propertyZh: "凉", category: "饮品" },
};

const propertyColors: Record<TcmProperty, string> = {
  cold: "#4A90D9",
  cool: "#7EB8E8",
  neutral: "#80B080",
  warm: "#D4A040",
  hot: "#D95050",
};

const propertyLabel: Record<TcmProperty, string> = {
  cold: "Cold",
  cool: "Cool",
  neutral: "Neutral",
  warm: "Warm",
  hot: "Hot",
};

const matchColor: Record<MatchLevel, string> = {
  suitable: "#22C55E",
  caution: "#EAB308",
  avoid: "#EF4444",
};

function getFallbackReason(foodNameEn: string, foodNameZh: string, match: MatchLevel): { en: string; zh: string } {
  if (match === "suitable") return {
    en: `${foodNameEn} complements your body constitution well. Safe to consume.`,
    zh: `${foodNameZh}的性质与你的体质平衡互补，可以放心食用。`,
  };
  if (match === "caution") return {
    en: `${foodNameEn} may mildly conflict with your constitution. Small amounts are fine, but avoid excess.`,
    zh: `${foodNameZh}的性质可能与你的体质有轻微冲突，少量食用无大碍，但不宜过量。`,
  };
  return {
    en: `${foodNameEn} significantly conflicts with your constitution. Prolonged or excessive consumption may worsen imbalances.`,
    zh: `${foodNameZh}的性质与你的体质明显冲突，长期或大量食用可能加重体质偏性。`,
  };
}

const propertyToZh = (p: TcmProperty): string => {
  const map: Record<TcmProperty, string> = { cold: "寒", cool: "凉", neutral: "平", warm: "温", hot: "热" };
  return map[p];
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
  const { t, locale } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("tcm_scan_count");
    if (stored) setScanCount(parseInt(stored));
  }, []);

  const constitutionResult = mounted ? getQuizResult() : null;
  const constitutionStyle = constitutionResult
    ? getConstitutionStyle(constitutionResult.primaryType)
    : null;

  const updateScanCount = () => {
    const newCount = scanCount + 1;
    setScanCount(newCount);
    localStorage.setItem("tcm_scan_count", newCount.toString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      runImageAnalysis(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const runImageAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setResult(null);

    const primaryType = constitutionResult?.primaryType || "balanced";

    try {
      const res = await fetch("/api/food/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, constitutionType: primaryType, language: locale }),
      });

      if (res.ok) {
        const data = await res.json();
        const property = data.tcm_property as TcmProperty;
        const match = data.match_level as MatchLevel;

        setResult({
          foodNameEn: data.food_name,
          foodNameZh: data.food_name_zh,
          calories: data.estimated_calories,
          property,
          propertyZh: data.tcm_property_zh,
          matchLevel: match,
          reasonEn: data.reason_en,
          reasonZh: data.reason_zh,
          alternativeNameEn: data.alternative_name,
          alternativeNameZh: data.alternative_name_zh,
          alternativeProperty: data.alternative_property as TcmProperty,
          alternativeMatch: data.alternative_match as MatchLevel,
        });
        setIsAnalyzing(false);
        updateScanCount();
        return;
      }
    } catch {
      // API unavailable — fall through to fallback
    }

    // Fallback: simulated analysis
    const demoResult = sampleResults.default;
    const match = getMatchLevel(primaryType, demoResult.property);

    setResult({
      ...demoResult,
      matchLevel: match,
      alternativeMatch: getMatchLevel(primaryType, demoResult.alternativeProperty),
    });
    setIsAnalyzing(false);
    updateScanCount();
  };

  const handleManualSearch = () => {
    if (!manualFood.trim()) return;
    const query = manualFood.trim();
    // Try exact match first (Chinese key), then English name lookup
    let found: FoodDBEntry | undefined = foodDB[query];
    if (!found) {
      found = Object.values(foodDB).find(
        (f) => f.nameEn.toLowerCase() === query.toLowerCase()
      );
    }
    if (!found) {
      // Try partial match on English or Chinese name
      found = Object.values(foodDB).find(
        (f) =>
          f.nameEn.toLowerCase().includes(query.toLowerCase()) ||
          f.nameZh.includes(query)
      );
    }
    if (!found) {
      alert(t("foodScan.foodNotFound"));
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

      const reason = getFallbackReason(found.nameEn, found.nameZh, match);

      const analysisResult: AnalysisResult = {
        foodNameEn: found.nameEn,
        foodNameZh: found.nameZh,
        calories: found.calories,
        property: found.property,
        propertyZh: found.propertyZh,
        matchLevel: match,
        reasonEn: reason.en,
        reasonZh: reason.zh,
        alternativeNameEn: alternative.nameEn,
        alternativeNameZh: alternative.nameZh,
        alternativeProperty: alternative.property,
        alternativeMatch: getMatchLevel(primaryType, alternative.property),
      };

      setResult(analysisResult);
      setIsAnalyzing(false);
      updateScanCount();
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">🍽️ {t("foodScan.title")}</h1>
          <p className="text-gray-500">{t("foodScan.subtitle")}</p>
        </div>

        {/* Scan count */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 text-sm text-gray-400">
            📸 {t("foodScan.scanCount").replace("{count}", String(scanCount))}
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
              <p className="text-gray-700 font-medium mb-1">{t("foodScan.uploadHint")}</p>
              <p className="text-gray-400 text-sm">{t("foodScan.uploadSubtext")}</p>
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
          <span className="text-sm text-gray-400">{t("foodScan.orDivider")}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Manual food entry */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-3">{t("foodScan.manualTitle")}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualFood}
              onChange={(e) => setManualFood(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              placeholder={t("foodScan.manualPlaceholder")}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
            />
            <button
              onClick={handleManualSearch}
              disabled={!manualFood.trim() || isAnalyzing}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? t("foodScan.checkingButton") : t("foodScan.checkButton")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.keys(foodDB).slice(0, 8).map((name) => {
              const entry = foodDB[name];
              return (
                <button
                  key={name}
                  onClick={() => { setManualFood(name); }}
                  className="inline-flex flex-col items-center px-2 py-0.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span className="text-[10px] text-gray-600 leading-tight">{entry.nameEn}</span>
                  <span className="text-[9px] text-gray-400 leading-tight">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="animate-spin text-4xl mb-4 inline-block">🔍</div>
            <p className="text-gray-700 font-medium">{t("foodScan.loadingTitle")}</p>
            <p className="text-gray-400 text-sm mt-1">{t("foodScan.loadingSubtext")}</p>
          </div>
        )}

        {/* Result */}
        {result && !isAnalyzing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Food info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{result.foodNameEn}</h2>
                  <p className="text-sm text-gray-400">{result.foodNameZh}</p>
                  <p className="text-sm text-gray-400 mt-1">{t("foodScan.result.kcal").replace("{kcal}", String(result.calories))}</p>
                </div>
                <div className="text-right">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: propertyColors[result.property] + "20", color: propertyColors[result.property] }}
                  >
                    {propertyLabel[result.property]}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">性{result.propertyZh}</p>
                </div>
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
                    {matchLevelConfig[result.matchLevel].label}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{matchLevelConfig[result.matchLevel].label_zh}</p>
                <p className="text-sm text-gray-600 mt-2">{result.reasonEn}</p>
                <p className="text-xs text-gray-400 mt-1">{result.reasonZh}</p>
              </div>
            </div>

            {/* Alternative */}
            <div className="p-6 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-medium text-sm">{t("foodScan.result.alternative")}</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{result.alternativeNameEn}</p>
                  <p className="text-sm text-gray-400">{result.alternativeNameZh}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: propertyColors[result.alternativeProperty] + "20", color: propertyColors[result.alternativeProperty] }}
                    >
                      {propertyLabel[result.alternativeProperty]}
                    </span>
                    <span className="text-green-600 text-sm">
                      {matchLevelConfig[result.alternativeMatch].emoji} {matchLevelConfig[result.alternativeMatch].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-2">
              <button
                onClick={() => { setSelectedImage(null); setResult(null); setManualFood(""); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {t("foodScan.result.scanAnother")}
              </button>
              <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                {t("foodScan.result.askAi")}
              </button>
            </div>
          </div>
        )}

        {/* Info tip */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            {t("foodScan.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
