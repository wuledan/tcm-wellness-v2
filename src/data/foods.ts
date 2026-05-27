export type TcmProperty = "cold" | "cool" | "neutral" | "warm" | "hot";
export type MatchLevel = "suitable" | "caution" | "avoid";

export interface Food {
  id: string;
  name_zh: string;
  name_en: string;
  property: TcmProperty;
  property_zh: string;
  calories_per_100g: number;
  category: string;
  description?: string;
  suitabilityMatrix: Record<string, MatchLevel>;
}

function propertyToZh(p: TcmProperty): string {
  const map: Record<TcmProperty, string> = {
    cold: "寒",
    cool: "凉",
    neutral: "平",
    warm: "温",
    hot: "热",
  };
  return map[p];
}

export function getMatchLevel(
  constitutionId: string,
  property: TcmProperty
): MatchLevel {
  const matrix: Record<string, Record<TcmProperty, MatchLevel>> = {
    qi_deficiency: { cold: "avoid", cool: "caution", neutral: "suitable", warm: "suitable", hot: "caution" },
    yang_deficiency: { cold: "avoid", cool: "avoid", neutral: "suitable", warm: "suitable", hot: "suitable" },
    yin_deficiency: { cold: "suitable", cool: "suitable", neutral: "suitable", warm: "caution", hot: "avoid" },
    phlegm_dampness: { cold: "caution", cool: "caution", neutral: "suitable", warm: "suitable", hot: "caution" },
    damp_heat: { cold: "suitable", cool: "suitable", neutral: "caution", warm: "avoid", hot: "avoid" },
    blood_stasis: { cold: "avoid", cool: "caution", neutral: "suitable", warm: "suitable", hot: "caution" },
    qi_stagnation: { cold: "caution", cool: "suitable", neutral: "suitable", warm: "suitable", hot: "caution" },
    intrinsic: { cold: "caution", cool: "suitable", neutral: "suitable", warm: "suitable", hot: "caution" },
    balanced: { cold: "suitable", cool: "suitable", neutral: "suitable", warm: "suitable", hot: "caution" },
  };

  return matrix[constitutionId]?.[property] ?? "caution";
}

const foods: Food[] = [
  // 谷物 Grains
  { id: "rice", name_zh: "粳米/大米", name_en: "Rice", property: "neutral", property_zh: "平", calories_per_100g: 116, category: "谷物", suitabilityMatrix: {} },
  { id: "sticky_rice", name_zh: "糯米", name_en: "Glutinous Rice", property: "warm", property_zh: "温", calories_per_100g: 350, category: "谷物", suitabilityMatrix: {} },
  { id: "millet", name_zh: "小米", name_en: "Millet", property: "cool", property_zh: "凉", calories_per_100g: 358, category: "谷物", suitabilityMatrix: {} },
  { id: "barley", name_zh: "薏米", name_en: "Coix Seed / Barley", property: "cool", property_zh: "凉", calories_per_100g: 353, category: "谷物", suitabilityMatrix: {} },
  { id: "wheat", name_zh: "小麦", name_en: "Wheat", property: "cool", property_zh: "凉", calories_per_100g: 339, category: "谷物", suitabilityMatrix: {} },
  { id: "oat", name_zh: "燕麦", name_en: "Oats", property: "warm", property_zh: "温", calories_per_100g: 367, category: "谷物", suitabilityMatrix: {} },

  // 蔬菜 Vegetables
  { id: "potato", name_zh: "土豆", name_en: "Potato", property: "neutral", property_zh: "平", calories_per_100g: 77, category: "蔬菜", suitabilityMatrix: {} },
  { id: "carrot", name_zh: "胡萝卜", name_en: "Carrot", property: "neutral", property_zh: "平", calories_per_100g: 41, category: "蔬菜", suitabilityMatrix: {} },
  { id: "pumpkin", name_zh: "南瓜", name_en: "Pumpkin", property: "warm", property_zh: "温", calories_per_100g: 26, category: "蔬菜", suitabilityMatrix: {} },
  { id: "cucumber", name_zh: "黄瓜", name_en: "Cucumber", property: "cool", property_zh: "凉", calories_per_100g: 16, category: "蔬菜", suitabilityMatrix: {} },
  { id: "winter_melon", name_zh: "冬瓜", name_en: "Winter Melon", property: "cool", property_zh: "凉", calories_per_100g: 12, category: "蔬菜", suitabilityMatrix: {} },
  { id: "bitter_melon", name_zh: "苦瓜", name_en: "Bitter Melon", property: "cold", property_zh: "寒", calories_per_100g: 19, category: "蔬菜", suitabilityMatrix: {} },
  { id: "spinach", name_zh: "菠菜", name_en: "Spinach", property: "cool", property_zh: "凉", calories_per_100g: 23, category: "蔬菜", suitabilityMatrix: {} },
  { id: "celery", name_zh: "芹菜", name_en: "Celery", property: "cool", property_zh: "凉", calories_per_100g: 16, category: "蔬菜", suitabilityMatrix: {} },
  { id: "white_radish", name_zh: "白萝卜", name_en: "White Radish", property: "cool", property_zh: "凉", calories_per_100g: 16, category: "蔬菜", suitabilityMatrix: {} },
  { id: "chinese_cabbage", name_zh: "白菜", name_en: "Chinese Cabbage", property: "cool", property_zh: "凉", calories_per_100g: 13, category: "蔬菜", suitabilityMatrix: {} },
  { id: "onion", name_zh: "洋葱", name_en: "Onion", property: "warm", property_zh: "温", calories_per_100g: 40, category: "蔬菜", suitabilityMatrix: {} },
  { id: "garlic", name_zh: "大蒜", name_en: "Garlic", property: "warm", property_zh: "温", calories_per_100g: 149, category: "蔬菜", suitabilityMatrix: {} },
  { id: "ginger", name_zh: "生姜", name_en: "Ginger", property: "warm", property_zh: "温", calories_per_100g: 80, category: "蔬菜", suitabilityMatrix: {} },
  { id: "seaweed", name_zh: "海带", name_en: "Seaweed", property: "cold", property_zh: "寒", calories_per_100g: 12, category: "蔬菜", suitabilityMatrix: {} },
  { id: "mushroom", name_zh: "蘑菇", name_en: "Mushroom", property: "neutral", property_zh: "平", calories_per_100g: 22, category: "蔬菜", suitabilityMatrix: {} },
  { id: "yam", name_zh: "山药", name_en: "Chinese Yam", property: "neutral", property_zh: "平", calories_per_100g: 57, category: "蔬菜", suitabilityMatrix: {} },
  { id: "lotus_root", name_zh: "莲藕", name_en: "Lotus Root", property: "cool", property_zh: "凉", calories_per_100g: 74, category: "蔬菜", suitabilityMatrix: {} },

  // 水果 Fruits
  { id: "watermelon", name_zh: "西瓜", name_en: "Watermelon", property: "cold", property_zh: "寒", calories_per_100g: 30, category: "水果", suitabilityMatrix: {} },
  { id: "pear", name_zh: "梨", name_en: "Pear", property: "cool", property_zh: "凉", calories_per_100g: 57, category: "水果", suitabilityMatrix: {} },
  { id: "apple", name_zh: "苹果", name_en: "Apple", property: "neutral", property_zh: "平", calories_per_100g: 52, category: "水果", suitabilityMatrix: {} },
  { id: "banana", name_zh: "香蕉", name_en: "Banana", property: "neutral", property_zh: "平", calories_per_100g: 89, category: "水果", suitabilityMatrix: {} },
  { id: "grape", name_zh: "葡萄", name_en: "Grape", property: "neutral", property_zh: "平", calories_per_100g: 69, category: "水果", suitabilityMatrix: {} },
  { id: "longan", name_zh: "桂圆", name_en: "Longan", property: "warm", property_zh: "温", calories_per_100g: 60, category: "水果", suitabilityMatrix: {} },
  { id: "lychee", name_zh: "荔枝", name_en: "Lychee", property: "hot", property_zh: "热", calories_per_100g: 66, category: "水果", suitabilityMatrix: {} },
  { id: "mango", name_zh: "芒果", name_en: "Mango", property: "cool", property_zh: "凉", calories_per_100g: 60, category: "水果", suitabilityMatrix: {} },
  { id: "hawthorn", name_zh: "山楂", name_en: "Hawthorn", property: "warm", property_zh: "温", calories_per_100g: 52, category: "水果", suitabilityMatrix: {} },
  { id: "orange", name_zh: "橙子", name_en: "Orange", property: "cool", property_zh: "凉", calories_per_100g: 47, category: "水果", suitabilityMatrix: {} },
  { id: "lily_bulb", name_zh: "百合", name_en: "Lily Bulb", property: "cool", property_zh: "凉", calories_per_100g: 166, category: "水果", suitabilityMatrix: {} },

  // 肉类 Meat & Poultry
  { id: "pork", name_zh: "猪肉", name_en: "Pork", property: "neutral", property_zh: "平", calories_per_100g: 242, category: "肉类", suitabilityMatrix: {} },
  { id: "beef", name_zh: "牛肉", name_en: "Beef", property: "warm", property_zh: "温", calories_per_100g: 250, category: "肉类", suitabilityMatrix: {} },
  { id: "lamb", name_zh: "羊肉", name_en: "Lamb", property: "hot", property_zh: "热", calories_per_100g: 294, category: "肉类", suitabilityMatrix: {} },
  { id: "chicken", name_zh: "鸡肉", name_en: "Chicken", property: "warm", property_zh: "温", calories_per_100g: 239, category: "肉类", suitabilityMatrix: {} },
  { id: "duck", name_zh: "鸭肉", name_en: "Duck", property: "cool", property_zh: "凉", calories_per_100g: 337, category: "肉类", suitabilityMatrix: {} },

  // 海鲜 Seafood
  { id: "fish", name_zh: "鱼类(通用)", name_en: "Fish (general)", property: "neutral", property_zh: "平", calories_per_100g: 100, category: "海鲜", suitabilityMatrix: {} },
  { id: "shrimp", name_zh: "虾", name_en: "Shrimp", property: "warm", property_zh: "温", calories_per_100g: 99, category: "海鲜", suitabilityMatrix: {} },
  { id: "crab", name_zh: "螃蟹", name_en: "Crab", property: "cold", property_zh: "寒", calories_per_100g: 87, category: "海鲜", suitabilityMatrix: {} },

  // 大豆 Nuts & Beans
  { id: "tofu", name_zh: "豆腐", name_en: "Tofu", property: "cool", property_zh: "凉", calories_per_100g: 76, category: "大豆制品", suitabilityMatrix: {} },
  { id: "soybean", name_zh: "黄豆", name_en: "Soybean", property: "neutral", property_zh: "平", calories_per_100g: 446, category: "大豆制品", suitabilityMatrix: {} },
  { id: "red_bean", name_zh: "赤小豆", name_en: "Red Bean / Adzuki Bean", property: "neutral", property_zh: "平", calories_per_100g: 329, category: "大豆制品", suitabilityMatrix: {} },
  { id: "mung_bean", name_zh: "绿豆", name_en: "Mung Bean", property: "cold", property_zh: "寒", calories_per_100g: 347, category: "大豆制品", suitabilityMatrix: {} },
  { id: "walnut", name_zh: "核桃", name_en: "Walnut", property: "warm", property_zh: "温", calories_per_100g: 654, category: "坚果", suitabilityMatrix: {} },
  { id: "black_bean", name_zh: "黑豆", name_en: "Black Bean", property: "neutral", property_zh: "平", calories_per_100g: 339, category: "大豆制品", suitabilityMatrix: {} },
  { id: "black_sesame", name_zh: "黑芝麻", name_en: "Black Sesame", property: "neutral", property_zh: "平", calories_per_100g: 573, category: "坚果", suitabilityMatrix: {} },
  { id: "peanut", name_zh: "花生", name_en: "Peanut", property: "neutral", property_zh: "平", calories_per_100g: 567, category: "坚果", suitabilityMatrix: {} },

  // 调味品 Condiments & Others
  { id: "honey", name_zh: "蜂蜜", name_en: "Honey", property: "neutral", property_zh: "平", calories_per_100g: 304, category: "调味品", suitabilityMatrix: {} },
  { id: "brown_sugar", name_zh: "红糖", name_en: "Brown Sugar", property: "warm", property_zh: "温", calories_per_100g: 373, category: "调味品", suitabilityMatrix: {} },
  { id: "vinegar", name_zh: "醋", name_en: "Vinegar", property: "warm", property_zh: "温", calories_per_100g: 18, category: "调味品", suitabilityMatrix: {} },
  { id: "goji_berry", name_zh: "枸杞", name_en: "Goji Berry", property: "neutral", property_zh: "平", calories_per_100g: 349, category: "药食同源", suitabilityMatrix: {} },
  { id: "astragalus", name_zh: "黄芪", name_en: "Astragalus", property: "warm", property_zh: "温", calories_per_100g: 200, category: "药食同源", suitabilityMatrix: {} },
  { id: "chinese_date", name_zh: "红枣", name_en: "Chinese Red Date (Jujube)", property: "warm", property_zh: "温", calories_per_100g: 287, category: "药食同源", suitabilityMatrix: {} },
  { id: "chrysanthemum", name_zh: "菊花", name_en: "Chrysanthemum", property: "cool", property_zh: "凉", calories_per_100g: 50, category: "药食同源", suitabilityMatrix: {} },
  { id: "mint", name_zh: "薄荷", name_en: "Peppermint", property: "cool", property_zh: "凉", calories_per_100g: 10, category: "药食同源", suitabilityMatrix: {} },
  { id: "cinnamon", name_zh: "肉桂", name_en: "Cinnamon", property: "hot", property_zh: "热", calories_per_100g: 247, category: "调味品", suitabilityMatrix: {} },
  { id: "lotus_seed", name_zh: "莲子", name_en: "Lotus Seed", property: "neutral", property_zh: "平", calories_per_100g: 89, category: "药食同源", suitabilityMatrix: {} },
  { id: "chuanxiong", name_zh: "川芎", name_en: "Sichuan Lovage", property: "warm", property_zh: "温", calories_per_100g: 100, category: "药食同源", suitabilityMatrix: {} },
  { id: "poria", name_zh: "茯苓", name_en: "Poria / Tuckahoe", property: "neutral", property_zh: "平", calories_per_100g: 16, category: "药食同源", suitabilityMatrix: {} },
  { id: "tangerine_peel", name_zh: "陈皮", name_en: "Tangerine Peel", property: "warm", property_zh: "温", calories_per_100g: 50, category: "药食同源", suitabilityMatrix: {} },
  { id: "rose", name_zh: "玫瑰花", name_en: "Rose", property: "warm", property_zh: "温", calories_per_100g: 50, category: "药食同源", suitabilityMatrix: {} },
  { id: "lotus_leaf", name_zh: "荷叶", name_en: "Lotus Leaf", property: "cool", property_zh: "凉", calories_per_100g: 10, category: "药食同源", suitabilityMatrix: {} },
  { id: "green_tea", name_zh: "绿茶", name_en: "Green Tea", property: "cool", property_zh: "凉", calories_per_100g: 1, category: "饮品", suitabilityMatrix: {} },
  { id: "black_tea", name_zh: "红茶", name_en: "Black Tea", property: "warm", property_zh: "温", calories_per_100g: 1, category: "饮品", suitabilityMatrix: {} },
  { id: "chrysanthemum_tea", name_zh: "菊花茶", name_en: "Chrysanthemum Tea", property: "cool", property_zh: "凉", calories_per_100g: 1, category: "饮品", suitabilityMatrix: {} },
  { id: "goji_tea", name_zh: "枸杞茶", name_en: "Goji Berry Tea", property: "neutral", property_zh: "平", calories_per_100g: 1, category: "饮品", suitabilityMatrix: {} },
];

export default foods;

export function getFoodById(id: string): Food | undefined {
  return foods.find((f) => f.id === id);
}

export function getFoodsByCategory(category: string): Food[] {
  return foods.filter((f) => f.category === category);
}

export const foodCategories = [
  "谷物", "蔬菜", "水果", "肉类", "海鲜", "大豆制品", "坚果", "调味品", "药食同源", "饮品",
] as const;

export const propertyColors: Record<TcmProperty, string> = {
  cold: "#4A90D9",
  cool: "#7EB8E8",
  neutral: "#80B080",
  warm: "#D4A040",
  hot: "#D95050",
};

/** Chinese → English food name lookup for bilingual rendering */
export const foodNameZhToEn: Record<string, string> = {
  // Generated from existing Food entries
  "粳米/大米": "Rice",
  "糯米": "Glutinous Rice",
  "小米": "Millet",
  "薏米": "Coix Seed / Barley",
  "小麦": "Wheat",
  "燕麦": "Oats",
  "土豆": "Potato",
  "胡萝卜": "Carrot",
  "南瓜": "Pumpkin",
  "黄瓜": "Cucumber",
  "冬瓜": "Winter Melon",
  "苦瓜": "Bitter Melon",
  "菠菜": "Spinach",
  "芹菜": "Celery",
  "白萝卜": "White Radish",
  "白菜": "Chinese Cabbage",
  "洋葱": "Onion",
  "大蒜": "Garlic",
  "生姜": "Ginger",
  "海带": "Seaweed",
  "蘑菇": "Mushroom",
  "山药": "Chinese Yam",
  "莲藕": "Lotus Root",
  "西瓜": "Watermelon",
  "梨": "Pear",
  "苹果": "Apple",
  "香蕉": "Banana",
  "葡萄": "Grape",
  "桂圆": "Longan",
  "荔枝": "Lychee",
  "芒果": "Mango",
  "山楂": "Hawthorn",
  "橙子": "Orange",
  "百合": "Lily Bulb",
  "猪肉": "Pork",
  "牛肉": "Beef",
  "羊肉": "Lamb",
  "鸡肉": "Chicken",
  "鸭肉": "Duck",
  "鱼类(通用)": "Fish (general)",
  "虾": "Shrimp",
  "螃蟹": "Crab",
  "豆腐": "Tofu",
  "黄豆": "Soybean",
  "赤小豆": "Red Bean / Adzuki Bean",
  "绿豆": "Mung Bean",
  "核桃": "Walnut",
  "黑豆": "Black Bean",
  "黑芝麻": "Black Sesame",
  "花生": "Peanut",
  "蜂蜜": "Honey",
  "红糖": "Brown Sugar",
  "醋": "Vinegar",
  "枸杞": "Goji Berry",
  "黄芪": "Astragalus",
  "红枣": "Chinese Red Date (Jujube)",
  "菊花": "Chrysanthemum",
  "薄荷": "Peppermint",
  "肉桂": "Cinnamon",
  "莲子": "Lotus Seed",
  "川芎": "Sichuan Lovage",
  "茯苓": "Poria / Tuckahoe",
  "陈皮": "Tangerine Peel",
  "玫瑰花": "Rose",
  "荷叶": "Lotus Leaf",
  "绿茶": "Green Tea",
  "红茶": "Black Tea",
  "菊花茶": "Chrysanthemum Tea",
  "枸杞茶": "Goji Berry Tea",
  // Additional constitution foods not in the main array
  "粳米": "Rice",
  "韭菜": "Chinese Chives",
  "银耳": "Snow Fungus",
  "玉米须": "Corn Silk",
  "黑木耳": "Black Fungus",
  "佛手": "Buddha's Hand Citron",
  "茉莉花": "Jasmine Flower",
  "大枣": "Chinese Red Date (Jujube)",
  "玫瑰茶": "Rose Tea",
  "各类均衡饮食": "Balanced Diet",
  "五谷杂粮": "Whole Grains",
  "新鲜蔬菜": "Fresh Vegetables",
  "水果": "Fruits",
  "瘦肉": "Lean Meat",
};

export const matchLevelConfig: Record<MatchLevel, { emoji: string; label: string; label_zh: string; color: string }> = {
  suitable: { emoji: "✅", label: "Suitable", label_zh: "适合", color: "#22C55E" },
  caution: { emoji: "⚠️", label: "Caution", label_zh: "谨慎", color: "#EAB308" },
  avoid: { emoji: "❌", label: "Avoid", label_zh: "避免", color: "#EF4444" },
};
