// 24 Solar Terms — astronomical calculation
// Based on Sun's ecliptic longitude (Meeus, Astronomical Algorithms)

export interface SolarTerm {
  id: number;
  name_zh: string;
  name_en: string;
  date: string; // computed per year, format "Mmm D"
  description: string;
  dietary_tip: string;
  lifestyle_tip: string;
}

const DEG = Math.PI / 180;

// --- Julian Date utilities ---

function toJD(year: number, month: number, day: number): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 - 0.5;
}

function fromJD(jd: number): Date {
  let jdInt = Math.floor(jd + 0.5);
  let f = jd + 0.5 - jdInt;
  let a: number;
  if (jdInt < 2299161) {
    a = jdInt;
  } else {
    let alpha = Math.floor((jdInt - 1867216.25) / 36524.25);
    a = jdInt + 1 + alpha - Math.floor(alpha / 4);
  }
  let b = a + 1524;
  let c = Math.floor((b - 122.1) / 365.25);
  let d = Math.floor(365.25 * c);
  let e = Math.floor((b - d) / 30.6001);
  let day = b - d - Math.floor(30.6001 * e) + f;
  let month = e < 14 ? e - 1 : e - 13;
  let year = month > 2 ? c - 4716 : c - 4715;
  return new Date(year, month - 1, Math.floor(day));
}

// --- Sun ecliptic longitude ---

function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG)
    + 0.000289 * Math.sin(3 * M * DEG);
  let lambda = (L0 + C) % 360;
  if (lambda < 0) lambda += 360;
  return lambda;
}

// --- Solar term date for a given year and ecliptic longitude ---

function solarTermJD(year: number, longitude: number): number {
  // Initial estimate from vernal equinox (春分, 0°) ≈ March 20
  let jd = toJD(year, 3, 20) + (longitude / 360) * 365.2422;

  // Newton-Raphson refinement (converges in 2-3 iterations)
  for (let i = 0; i < 5; i++) {
    const sl = sunLongitude(jd);
    let diff = longitude - sl;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    jd += diff / 0.9856; // Sun's mean daily motion
  }
  return jd;
}

function formatDate(d: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// --- Static term data (without dates) ---

interface TermDef {
  id: number;
  name_zh: string;
  name_en: string;
  longitude: number; // ecliptic longitude in degrees
  description: string;
  dietary_tip: string;
  lifestyle_tip: string;
}

const termDefs: TermDef[] = [
  { id: 1,  name_zh: "立春", name_en: "Start of Spring",       longitude: 315, description: "The beginning of spring. Qi starts to rise and expand.", dietary_tip: "Eat warming foods to support the rising Yang Qi. Include leeks, onions, and ginger.", lifestyle_tip: "Start exercising moderately. Stretch the body to welcome spring energy." },
  { id: 2,  name_zh: "雨水", name_en: "Rain Water",             longitude: 330, description: "Increased rainfall and humidity. Dampness begins to rise.", dietary_tip: "Eat foods that resolve dampness:薏米 (coix seed), winter melon, and red beans.", lifestyle_tip: "Avoid damp environments. Keep feet dry and warm." },
  { id: 3,  name_zh: "惊蛰", name_en: "Awakening of Insects",   longitude: 345, description: "Temperatures rise and thunder begins. All life awakens.", dietary_tip: "Eat light, cooling foods. Pear is excellent for moistening the lungs.", lifestyle_tip: "Increase outdoor activities. Stretch and move more." },
  { id: 4,  name_zh: "春分", name_en: "Spring Equinox",         longitude: 0,   description: "Day and night are equal. Balance of Yin and Yang.", dietary_tip: "Balance cooling and warming foods. Avoid extremes.", lifestyle_tip: "Maintain a regular schedule. Meditate to find inner balance." },
  { id: 5,  name_zh: "清明", name_en: "Clear and Bright",       longitude: 15,  description: "Clear weather, bright skies. Spring is in full swing.", dietary_tip: "Eat wild greens and light vegetables to cleanse the liver.", lifestyle_tip: "Go outdoors and connect with nature. Moderate exercise is ideal." },
  { id: 6,  name_zh: "谷雨", name_en: "Grain Rain",             longitude: 30,  description: "Rain nourishes the grains. Increased humidity.", dietary_tip: "Eat foods that strengthen the spleen:山药 (yam), millet porridge.", lifestyle_tip: "Protect against dampness. Avoid excessive sitting." },
  { id: 7,  name_zh: "立夏", name_en: "Start of Summer",        longitude: 45,  description: "Summer begins. Heat starts to build.", dietary_tip: "Eat lighter, cooling foods. Increase vegetable intake.", lifestyle_tip: "Wake up earlier. Avoid midday heat exposure." },
  { id: 8,  name_zh: "小满", name_en: "Grain Buds",             longitude: 60,  description: "Grains begin to fill but are not yet ripe.", dietary_tip: "Eat bitter foods like bitter melon to clear heat.", lifestyle_tip: "Avoid excessive sweating. Stay hydrated." },
  { id: 9,  name_zh: "芒种", name_en: "Grain in Ear",           longitude: 75,  description: "Wheat ripens. Hot and humid weather begins.", dietary_tip: "Eat light, cooling foods. Mung bean soup is excellent.", lifestyle_tip: "Take short naps. Bathe regularly to feel refreshed." },
  { id: 10, name_zh: "夏至", name_en: "Summer Solstice",        longitude: 90,  description: "Longest day of the year. Peak Yang energy.", dietary_tip: "Eat foods that nourish Yin: lotus root, duck, and barley.", lifestyle_tip: "Rest during the hottest part of the day." },
  { id: 11, name_zh: "小暑", name_en: "Minor Heat",             longitude: 105, description: "Heat becomes intense but has not peaked.", dietary_tip: "Eat cooling foods: watermelon, cucumber, mung beans.", lifestyle_tip: "Stay in cool environments. Drink plenty of fluids." },
  { id: 12, name_zh: "大暑", name_en: "Major Heat",             longitude: 120, description: "The hottest time of the year.", dietary_tip: "Eat light, easily digestible foods. Avoid greasy and spicy.", lifestyle_tip: "Avoid strenuous outdoor activities during peak heat." },
  { id: 13, name_zh: "立秋", name_en: "Start of Autumn",        longitude: 135, description: "Autumn begins. Yang starts to decline.", dietary_tip: "Eat moistening foods: pear, lily bulb, and white fungus.", lifestyle_tip: "Begin to wind down. Reduce intense exercise." },
  { id: 14, name_zh: "处暑", name_en: "End of Heat",            longitude: 150, description: "Heat subsides. Dryness begins to appear.", dietary_tip: "Eat foods that moisten dryness: sesame, honey, and pear.", lifestyle_tip: "Adjust sleep schedule to go to bed earlier." },
  { id: 15, name_zh: "白露", name_en: "White Dew",              longitude: 165, description: "Temperatures drop. Dew forms at night.", dietary_tip: "Eat warm, nourishing foods. Avoid raw and cold foods.", lifestyle_tip: "Cover the body at night. Protect the neck from cold." },
  { id: 16, name_zh: "秋分", name_en: "Autumn Equinox",         longitude: 180, description: "Day and night equal again. Yin and Yang balanced.", dietary_tip: "Balance your diet. Eat seasonal autumn vegetables.", lifestyle_tip: "Practice moderation in all activities." },
  { id: 17, name_zh: "寒露", name_en: "Cold Dew",               longitude: 195, description: "Dew turns cold. Weather becomes noticeably cooler.", dietary_tip: "Eat warming foods: ginger, cinnamon, lamb soup.", lifestyle_tip: "Increase layer of clothing. Soak feet in warm water." },
  { id: 18, name_zh: "霜降", name_en: "Frost Descent",          longitude: 210, description: "Frost appears. Cold weather sets in.", dietary_tip: "Eat nutrient-dense foods: chicken soup, yam, and chestnuts.", lifestyle_tip: "Keep warm. Avoid cold drafts." },
  { id: 19, name_zh: "立冬", name_en: "Start of Winter",        longitude: 225, description: "Winter begins. Storing and conserving energy.", dietary_tip: "Eat warming, hearty foods: lamb, beef, and root vegetables.", lifestyle_tip: "Rest more. Reduce physical exertion." },
  { id: 20, name_zh: "小雪", name_en: "Minor Snow",             longitude: 240, description: "Light snowfall begins. Cold intensifies.", dietary_tip: "Eat warming, blood-nourishing foods: red dates, longan.", lifestyle_tip: "Keep the feet warm. Avoid emotional stress." },
  { id: 21, name_zh: "大雪", name_en: "Major Snow",             longitude: 255, description: "Heavy snowfall. The deepest cold of winter.", dietary_tip: "Eat yang-nourishing foods: mutton, ginger, and cinnamon.", lifestyle_tip: "Conserve energy. Sleep early and wake late." },
  { id: 22, name_zh: "冬至", name_en: "Winter Solstice",        longitude: 270, description: "Shortest day. Yin at its peak, Yang begins to rise.", dietary_tip: "Eat warming foods to nourish the newly born Yang.", lifestyle_tip: "Rest deeply. It's the most important day for rejuvenation." },
  { id: 23, name_zh: "小寒", name_en: "Minor Cold",             longitude: 285, description: "Severe cold but not yet the coldest.", dietary_tip: "Eat warming, kidney-nourishing foods: black beans, walnuts.", lifestyle_tip: "Keep extremities warm. Avoid cold exposure." },
  { id: 24, name_zh: "大寒", name_en: "Major Cold",             longitude: 300, description: "The coldest day of the year.", dietary_tip: "Eat rich, warming foods to store energy for spring.", lifestyle_tip: "Stay indoors and rest. Prepare for the coming spring." },
];

// --- Computed terms for a given year ---

function computeTermsForYear(year: number): SolarTerm[] {
  return termDefs.map((def) => ({
    ...def,
    date: formatDate(fromJD(solarTermJD(year, def.longitude))),
  }));
}

// --- Current year terms (recomputed once per module load, then cached) ---

let cachedYear = 0;
let cachedTerms: SolarTerm[] = [];

export function getSolarTerms(): SolarTerm[] {
  const year = new Date().getFullYear();
  if (year !== cachedYear) {
    cachedTerms = computeTermsForYear(year);
    cachedYear = year;
  }
  return cachedTerms;
}

// For backward compatibility — re-export current year's terms
export const solarTerms = new Proxy({} as SolarTerm[], {
  get(_target, prop) {
    return getSolarTerms()[prop as any];
  },
  getOwnPropertyDescriptor(_target, prop) {
    const terms = getSolarTerms();
    if (prop in terms) {
      return { value: terms[prop as any], writable: false, enumerable: true, configurable: true };
    }
    return undefined;
  },
  ownKeys() {
    return Reflect.ownKeys(getSolarTerms());
  },
}) as SolarTerm[];

// Make iterable
Object.defineProperty(solarTerms, Symbol.iterator, {
  value: function* () { yield* getSolarTerms(); }
});
Object.defineProperty(solarTerms, 'length', {
  get() { return getSolarTerms().length; }
});

// --- Get current solar term ---

export function getCurrentSolarTerm(): SolarTerm {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayNum = month * 100 + day;

  const terms = getSolarTerms();
  const MONTHS: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  let latest: SolarTerm | null = null;
  let latestNum = 0;

  for (const term of terms) {
    const [m, d] = term.date.split(" ");
    const termNum = MONTHS[m] * 100 + parseInt(d);
    if (termNum <= todayNum && termNum > latestNum) {
      latest = term;
      latestNum = termNum;
    }
  }

  return latest || terms[23]; // fallback to 大寒
}
