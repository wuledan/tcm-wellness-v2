export interface QuizOption {
  label: string;
  label_en: string;
  value: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  question_en: string;
  emoji: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "你通常感觉身体是偏冷还是偏热？",
    question_en: "Do you generally feel cold or hot?",
    emoji: "🌡️",
    options: [
      { label: "非常怕冷", label_en: "Very cold, always need extra layers", value: "yang_deficiency" },
      { label: "偏冷", label_en: "Slightly cold", value: "qi_deficiency" },
      { label: "偏热", label_en: "Slightly hot", value: "yin_deficiency" },
      { label: "正常", label_en: "Normal", value: "balanced" },
    ],
  },
  {
    id: 2,
    question: "你的睡眠质量如何？",
    question_en: "How is your sleep quality?",
    emoji: "😴",
    options: [
      { label: "入睡困难", label_en: "Difficulty falling asleep", value: "yin_deficiency" },
      { label: "多梦易醒", label_en: "Dream-filled, easy to wake", value: "qi_stagnation" },
      { label: "早醒", label_en: "Wake up early and can't go back", value: "yin_deficiency" },
      { label: "正常", label_en: "Normal", value: "balanced" },
    ],
  },
  {
    id: 3,
    question: "你容易感到疲劳吗？",
    question_en: "Do you fatigue easily?",
    emoji: "😮‍💨",
    options: [
      { label: "非常容易", label_en: "Very easily fatigued", value: "qi_deficiency" },
      { label: "偶尔", label_en: "Occasionally", value: "phlegm_dampness" },
      { label: "不容易", label_en: "Rarely", value: "balanced" },
      { label: "越休息越累", label_en: "More tired after resting", value: "damp_heat" },
    ],
  },
  {
    id: 4,
    question: "你的消化系统怎么样？",
    question_en: "How is your digestive health?",
    emoji: "🍽️",
    options: [
      { label: "胃胀胀气", label_en: "Bloating and gas", value: "qi_stagnation" },
      { label: "容易便秘", label_en: "Prone to constipation", value: "yin_deficiency" },
      { label: "容易腹泻", label_en: "Prone to diarrhea", value: "yang_deficiency" },
      { label: "正常", label_en: "Normal", value: "balanced" },
    ],
  },
  {
    id: 5,
    question: "你容易水肿吗？",
    question_en: "Do you experience water retention?",
    emoji: "💧",
    options: [
      { label: "经常水肿", label_en: "Frequent swelling", value: "phlegm_dampness" },
      { label: "偶尔", label_en: "Occasionally", value: "damp_heat" },
      { label: "不会", label_en: "No", value: "balanced" },
      { label: "晨起眼睑肿", label_en: "Puffy eyes in the morning", value: "qi_deficiency" },
    ],
  },
  {
    id: 6,
    question: "你的皮肤状态？",
    question_en: "What is your skin condition?",
    emoji: "🧴",
    options: [
      { label: "干燥", label_en: "Dry", value: "yin_deficiency" },
      { label: "油腻", label_en: "Oily", value: "damp_heat" },
      { label: "敏感易过敏", label_en: "Sensitive, prone to allergies", value: "intrinsic" },
      { label: "正常", label_en: "Normal", value: "balanced" },
    ],
  },
  {
    id: 7,
    question: "你的情绪倾向？",
    question_en: "What describes your emotional tendency?",
    emoji: "💭",
    options: [
      { label: "易怒烦躁", label_en: "Irritable and restless", value: "damp_heat" },
      { label: "焦虑担忧", label_en: "Anxious and worried", value: "qi_stagnation" },
      { label: "忧郁低落", label_en: "Melancholy and low", value: "qi_stagnation" },
      { label: "平和", label_en: "Peaceful and calm", value: "balanced" },
    ],
  },
  {
    id: 8,
    question: "你的出汗情况？",
    question_en: "How is your sweating?",
    emoji: "💦",
    options: [
      { label: "多汗", label_en: "Excessive sweating", value: "qi_deficiency" },
      { label: "少汗或无汗", label_en: "Little or no sweating", value: "blood_stasis" },
      { label: "盗汗(睡眠中出汗)", label_en: "Night sweats", value: "yin_deficiency" },
      { label: "正常", label_en: "Normal", value: "balanced" },
    ],
  },
  {
    id: 9,
    question: "你的体重变化？",
    question_en: "How does your weight tend to change?",
    emoji: "⚖️",
    options: [
      { label: "易胖难减", label_en: "Easy to gain, hard to lose", value: "phlegm_dampness" },
      { label: "易瘦难增", label_en: "Easy to lose, hard to gain", value: "qi_deficiency" },
      { label: "体重波动大", label_en: "Significant weight fluctuations", value: "qi_stagnation" },
      { label: "稳定", label_en: "Stable", value: "balanced" },
    ],
  },
];

export interface QuizResult {
  primaryType: string;
  secondaryType: string | null;
  scores: Record<string, number>;
}

export function calculateQuizResult(answers: Record<number, string>): QuizResult {
  const scores: Record<string, number> = {};

  for (const value of Object.values(answers)) {
    scores[value] = (scores[value] || 0) + 1;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return {
    primaryType: sorted[0]?.[0] || "balanced",
    secondaryType: sorted[1]?.[0] || null,
    scores,
  };
}
