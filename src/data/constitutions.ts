export interface Constitution {
  id: string;
  name_zh: string;
  name_en: string;
  color: string;
  bgColor: string;
  emoji: string;
  description: string;
  diet_principle: string;
  recommended_foods: string[];
  avoid_foods: string[];
  exercise: string;
  lifestyle_tips: string[];
  symptoms: string[];
}

export const constitutions: Constitution[] = [
  {
    id: "qi_deficiency",
    name_zh: "气虚质",
    name_en: "Qi Deficiency",
    color: "#D4A574",
    bgColor: "#FFF8F0",
    emoji: "💨",
    description:
      "You often feel fatigued, short of breath, and have a weak voice. Your energy (Qi) is insufficient, making you prone to catching colds and feeling drained after minimal activity.",
    diet_principle: "Eat warm, nourishing foods. Avoid raw, cold foods that deplete Qi.",
    recommended_foods: ["山药", "鸡肉", "红枣", "黄芪", "粳米", "土豆", "南瓜", "牛肉"],
    avoid_foods: ["西瓜", "苦瓜", "螃蟹", "冰饮", "生菜", "萝卜"],
    exercise: "Gentle movement: Tai Chi, walking, Ba Duan Jin (八段锦)",
    lifestyle_tips: [
      "Go to bed early and wake up early",
      "Avoid overexertion",
      "Take a 15-30 minute midday nap",
      "Practice deep breathing exercises",
    ],
    symptoms: ["疲劳乏力", "气短懒言", "自汗", "易感冒", "面色苍白"],
  },
  {
    id: "yang_deficiency",
    name_zh: "阳虚质",
    name_en: "Yang Deficiency",
    color: "#A8C8E8",
    bgColor: "#F0F8FF",
    emoji: "❄️",
    description:
      "You feel cold easily, especially in your hands and feet. Your body lacks warming Yang energy, making you prefer warm drinks and warm weather.",
    diet_principle: "Eat warming and hot-natured foods. Avoid cold and raw foods.",
    recommended_foods: ["羊肉", "韭菜", "生姜", "桂圆", "核桃", "肉桂", "荔枝", "虾"],
    avoid_foods: ["梨", "绿豆", "冰饮", "西瓜", "苦瓜", "螃蟹", "柿子"],
    exercise: "Moderate exercise that generates body heat: Tai Chi, jogging, Ba Duan Jin",
    lifestyle_tips: [
      "Soak feet in warm water before bed",
      "Avoid cold environments",
      "Apply warm compress to lower back",
      "Sunbathe moderately in the morning",
    ],
    symptoms: ["怕冷", "手脚冰凉", "喜热饮", "腰膝酸冷", "夜尿多"],
  },
  {
    id: "yin_deficiency",
    name_zh: "阴虚质",
    name_en: "Yin Deficiency",
    color: "#E8A0A0",
    bgColor: "#FFF5F5",
    emoji: "🔥",
    description:
      "You often feel hot, have dry mouth and throat, and experience night sweats. Your body's cooling Yin fluids are insufficient, creating a state of 'internal heat.'",
    diet_principle: "Eat cooling and moistening foods. Avoid warming and drying foods.",
    recommended_foods: ["百合", "银耳", "鸭肉", "梨", "莲子", "枸杞", "黑芝麻", "豆腐"],
    avoid_foods: ["羊肉", "辣椒", "桂圆", "荔枝", "生姜", "大蒜", "酒"],
    exercise: "Moderate, non-strenuous exercise: swimming, walking, yoga",
    lifestyle_tips: [
      "Avoid staying up late",
      "Reduce spicy food intake",
      "Practice meditation to calm the mind",
      "Keep bedroom cool and well-ventilated",
    ],
    symptoms: ["手脚心发热", "口干咽燥", "盗汗", "失眠多梦", "大便干结"],
  },
  {
    id: "phlegm_dampness",
    name_zh: "痰湿质",
    name_en: "Phlegm-Dampness",
    color: "#C8B8A0",
    bgColor: "#F8F4F0",
    emoji: "💧",
    description:
      "You tend to be overweight, feel heavy and sluggish, and have a feeling of phlegm in your throat. Dampness accumulates in your body due to poor fluid metabolism.",
    diet_principle: "Eat warm, drying foods that transform phlegm. Avoid greasy and sweet foods.",
    recommended_foods: ["薏米", "冬瓜", "陈皮", "茯苓", "赤小豆", "白萝卜", "海带", "玉米须"],
    avoid_foods: ["甜品", "油炸", "肥肉", "冰淇淋", "奶茶", "糯米", "香蕉"],
    exercise: "Active exercise that induces sweating: running, cycling, brisk walking",
    lifestyle_tips: [
      "Exercise regularly to promote sweating",
      "Avoid damp environments",
      "Keep a consistent meal schedule",
      "Drink warm ginger tea",
    ],
    symptoms: ["体型肥胖", "身体沉重", "痰多", "舌苔厚腻", "胸闷"],
  },
  {
    id: "damp_heat",
    name_zh: "湿热质",
    name_en: "Damp-Heat",
    color: "#D4A040",
    bgColor: "#FFFAF0",
    emoji: "☀️",
    description:
      "You have oily skin, a bitter taste in your mouth, and sticky stools. Dampness and heat combine in your body, creating a condition of stagnation and inflammation.",
    diet_principle: "Eat cooling and drying foods that clear heat and resolve dampness.",
    recommended_foods: ["绿豆", "苦瓜", "荷叶", "黄瓜", "芹菜", "冬瓜", "薏米", "绿茶"],
    avoid_foods: ["羊肉", "酒", "辣椒", "油炸", "芒果", "榴莲", "龙眼"],
    exercise: "Vigorous exercise that promotes sweating: running, swimming, ball sports",
    lifestyle_tips: [
      "Avoid humid environments",
      "Wear breathable clothing",
      "Keep living space well-ventilated",
      "Avoid excessive alcohol consumption",
    ],
    symptoms: ["面部出油", "口苦", "大便黏滞", "小便黄", "容易生痤疮"],
  },
  {
    id: "blood_stasis",
    name_zh: "血瘀质",
    name_en: "Blood Stasis",
    color: "#A06070",
    bgColor: "#FDF0F5",
    emoji: "🩸",
    description:
      "You have dark complexion,容易 bruise easily, and may experience sharp pains. Your blood circulation is not smooth, leading to stagnation.",
    diet_principle: "Eat warming foods that promote blood circulation. Avoid cold foods that cause stagnation.",
    recommended_foods: ["山楂", "黑豆", "醋", "洋葱", "大蒜", "红糖", "玫瑰茶", "黑木耳"],
    avoid_foods: ["冰饮", "冷食", "螃蟹", "苦瓜", "生冷沙拉"],
    exercise: "Moderate cardiovascular exercise: jogging, dancing, stretching",
    lifestyle_tips: [
      "Stay physically active",
      "Avoid prolonged sitting",
      "Practice emotional expression",
      "Warm compress on painful areas",
    ],
    symptoms: ["肤色暗沉", "易有瘀斑", "面色晦暗", "痛经", "舌质紫暗"],
  },
  {
    id: "qi_stagnation",
    name_zh: "气郁质",
    name_en: "Qi Stagnation",
    color: "#A0B870",
    bgColor: "#F5F8F0",
    emoji: "🌊",
    description:
      "You are prone to mood swings, frustration, and a sensation of a lump in your throat. Your Qi energy is stuck and not flowing smoothly.",
    diet_principle: "Eat foods that promote Qi circulation. Avoid heavy, greasy foods that cause stagnation.",
    recommended_foods: ["玫瑰花", "佛手", "白萝卜", "茉莉花", "陈皮", "薄荷", "山楂", "小麦"],
    avoid_foods: ["肥肉", "甜品", "冰淇淋", "油炸食品", "粘腻食物"],
    exercise: "Mind-body exercise that helps release emotions: yoga, Tai Chi, dancing",
    lifestyle_tips: [
      "Practice emotional expression",
      "Listen to calming music",
      "Spend time in nature",
      "Talk to friends and family regularly",
    ],
    symptoms: ["情绪低落", "叹气", "胸闷", "胁肋胀痛", "咽喉异物感"],
  },
  {
    id: "intrinsic",
    name_zh: "特禀质",
    name_en: "Intrinsic (Allergic)",
    color: "#B0A0C8",
    bgColor: "#F8F5FC",
    emoji: "🌸",
    description:
      "You have an allergic constitution, prone to reactions from certain foods, pollens, or environmental changes. Your immune system is sensitive and reactive.",
    diet_principle: "Eat neutral, gentle foods that strengthen the immune system. Avoid known allergens and 'hair triggering' foods.",
    recommended_foods: ["黄芪", "山药", "粳米", "土豆", "白菜", "猪肉", "蜂蜜", "大枣"],
    avoid_foods: ["海鲜", "芒果", "酒精", "辛辣", "花生", "牛奶", "鸡蛋"],
    exercise: "Moderate, consistent exercise: walking, Tai Chi, swimming (if no skin allergies)",
    lifestyle_tips: [
      "Identify and avoid allergens",
      "Keep home clean and dust-free",
      "Wear a mask during high pollen seasons",
      "Build immunity through gentle exercise",
    ],
    symptoms: ["容易过敏", "打喷嚏", "皮肤瘙痒", "荨麻疹", "哮喘"],
  },
  {
    id: "balanced",
    name_zh: "平和质",
    name_en: "Balanced",
    color: "#80B080",
    bgColor: "#F0F8F0",
    emoji: "🌿",
    description:
      "You have a balanced constitution with good energy, stable mood, and strong immunity. Your body's Yin and Yang are in harmony.",
    diet_principle: "Maintain a balanced diet with variety. No strict restrictions, but avoid excess of any extreme food.",
    recommended_foods: ["各类均衡饮食", "五谷杂粮", "新鲜蔬菜", "水果", "瘦肉"],
    avoid_foods: ["过量任何属性食物", "过度加工食品", "暴饮暴食"],
    exercise: "Regular exercise of your choice: walking, sports, yoga, swimming",
    lifestyle_tips: [
      "Maintain your balanced lifestyle",
      "Stay active consistently",
      "Eat a varied, colorful diet",
      "Keep regular sleep hours",
    ],
    symptoms: ["体态匀称", "精力充沛", "情绪稳定", "食欲正常", "睡眠良好"],
  },
];

export function getConstitutionById(id: string): Constitution | undefined {
  return constitutions.find((c) => c.id === id);
}

export const constitutionIdOrder: string[] = constitutions.map((c) => c.id);
