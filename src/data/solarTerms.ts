export interface SolarTerm {
  id: number;
  name_zh: string;
  name_en: string;
  date: string; // approx date
  description: string;
  dietary_tip: string;
  lifestyle_tip: string;
}

export const solarTerms: SolarTerm[] = [
  { id: 1, name_zh: "立春", name_en: "Start of Spring", date: "Feb 4", description: "The beginning of spring. Qi starts to rise and expand.", dietary_tip: "Eat warming foods to support the rising Yang Qi. Include leeks, onions, and ginger.", lifestyle_tip: "Start exercising moderately. Stretch the body to welcome spring energy." },
  { id: 2, name_zh: "雨水", name_en: "Rain Water", date: "Feb 19", description: "Increased rainfall and humidity. Dampness begins to rise.", dietary_tip: "Eat foods that resolve dampness:薏米 (coix seed), winter melon, and red beans.", lifestyle_tip: "Avoid damp environments. Keep feet dry and warm." },
  { id: 3, name_zh: "惊蛰", name_en: "Awakening of Insects", date: "Mar 6", description: "Temperatures rise and thunder begins. All life awakens.", dietary_tip: "Eat light, cooling foods. Pear is excellent for moistening the lungs.", lifestyle_tip: "Increase outdoor activities. Stretch and move more." },
  { id: 4, name_zh: "春分", name_en: "Spring Equinox", date: "Mar 21", description: "Day and night are equal. Balance of Yin and Yang.", dietary_tip: "Balance cooling and warming foods. Avoid extremes.", lifestyle_tip: "Maintain a regular schedule. Meditate to find inner balance." },
  { id: 5, name_zh: "清明", name_en: "Clear and Bright", date: "Apr 5", description: "Clear weather, bright skies. Spring is in full swing.", dietary_tip: "Eat wild greens and light vegetables to cleanse the liver.", lifestyle_tip: "Go outdoors and connect with nature. Moderate exercise is ideal." },
  { id: 6, name_zh: "谷雨", name_en: "Grain Rain", date: "Apr 20", description: "Rain nourishes the grains. Increased humidity.", dietary_tip: "Eat foods that strengthen the spleen:山药 (yam), millet porridge.", lifestyle_tip: "Protect against dampness. Avoid excessive sitting." },
  { id: 7, name_zh: "立夏", name_en: "Start of Summer", date: "May 6", description: "Summer begins. Heat starts to build.", dietary_tip: "Eat lighter, cooling foods. Increase vegetable intake.", lifestyle_tip: "Wake up earlier. Avoid midday heat exposure." },
  { id: 8, name_zh: "小满", name_en: "Grain Buds", date: "May 21", description: "Grains begin to fill but are not yet ripe.", dietary_tip: "Eat bitter foods like bitter melon to clear heat.", lifestyle_tip: "Avoid excessive sweating. Stay hydrated." },
  { id: 9, name_zh: "芒种", name_en: "Grain in Ear", date: "Jun 6", description: "Wheat ripens. Hot and humid weather begins.", dietary_tip: "Eat light, cooling foods. Mung bean soup is excellent.", lifestyle_tip: "Take short naps. Bathe regularly to feel refreshed." },
  { id: 10, name_zh: "夏至", name_en: "Summer Solstice", date: "Jun 21", description: "Longest day of the year. Peak Yang energy.", dietary_tip: "Eat foods that nourish Yin: lotus root, duck, and barley.", lifestyle_tip: "Rest during the hottest part of the day." },
  { id: 11, name_zh: "小暑", name_en: "Minor Heat", date: "Jul 7", description: "Heat becomes intense but has not peaked.", dietary_tip: "Eat cooling foods: watermelon, cucumber, mung beans.", lifestyle_tip: "Stay in cool environments. Drink plenty of fluids." },
  { id: 12, name_zh: "大暑", name_en: "Major Heat", date: "Jul 23", description: "The hottest time of the year.", dietary_tip: "Eat light, easily digestible foods. Avoid greasy and spicy.", lifestyle_tip: "Avoid strenuous outdoor activities during peak heat." },
  { id: 13, name_zh: "立秋", name_en: "Start of Autumn", date: "Aug 7", description: "Autumn begins. Yang starts to decline.", dietary_tip: "Eat moistening foods: pear, lily bulb, and white fungus.", lifestyle_tip: "Begin to wind down. Reduce intense exercise." },
  { id: 14, name_zh: "处暑", name_en: "End of Heat", date: "Aug 23", description: "Heat subsides. Dryness begins to appear.", dietary_tip: "Eat foods that moisten dryness: sesame, honey, and pear.", lifestyle_tip: "Adjust sleep schedule to go to bed earlier." },
  { id: 15, name_zh: "白露", name_en: "White Dew", date: "Sep 8", description: "Temperatures drop. Dew forms at night.", dietary_tip: "Eat warm, nourishing foods. Avoid raw and cold foods.", lifestyle_tip: "Cover the body at night. Protect the neck from cold." },
  { id: 16, name_zh: "秋分", name_en: "Autumn Equinox", date: "Sep 23", description: "Day and night equal again. Yin and Yang balanced.", dietary_tip: "Balance your diet. Eat seasonal autumn vegetables.", lifestyle_tip: "Practice moderation in all activities." },
  { id: 17, name_zh: "寒露", name_en: "Cold Dew", date: "Oct 8", description: "Dew turns cold. Weather becomes noticeably cooler.", dietary_tip: "Eat warming foods: ginger, cinnamon, lamb soup.", lifestyle_tip: "Increase layer of clothing. Soak feet in warm water." },
  { id: 18, name_zh: "霜降", name_en: "Frost Descent", date: "Oct 23", description: "Frost appears. Cold weather sets in.", dietary_tip: "Eat nutrient-dense foods: chicken soup, yam, and chestnuts.", lifestyle_tip: "Keep warm. Avoid cold drafts." },
  { id: 19, name_zh: "立冬", name_en: "Start of Winter", date: "Nov 7", description: "Winter begins. Storing and conserving energy.", dietary_tip: "Eat warming, hearty foods: lamb, beef, and root vegetables.", lifestyle_tip: "Rest more. Reduce physical exertion." },
  { id: 20, name_zh: "小雪", name_en: "Minor Snow", date: "Nov 22", description: "Light snowfall begins. Cold intensifies.", dietary_tip: "Eat warming, blood-nourishing foods: red dates, longan.", lifestyle_tip: "Keep the feet warm. Avoid emotional stress." },
  { id: 21, name_zh: "大雪", name_en: "Major Snow", date: "Dec 7", description: "Heavy snowfall. The deepest cold of winter.", dietary_tip: "Eat yang-nourishing foods: mutton, ginger, and cinnamon.", lifestyle_tip: "Conserve energy. Sleep early and wake late." },
  { id: 22, name_zh: "冬至", name_en: "Winter Solstice", date: "Dec 22", description: "Shortest day. Yin at its peak, Yang begins to rise.", dietary_tip: "Eat warming foods to nourish the newly born Yang.", lifestyle_tip: "Rest deeply. It's the most important day for rejuvenation." },
  { id: 23, name_zh: "小寒", name_en: "Minor Cold", date: "Jan 6", description: "Severe cold but not yet the coldest.", dietary_tip: "Eat warming, kidney-nourishing foods: black beans, walnuts.", lifestyle_tip: "Keep extremities warm. Avoid cold exposure." },
  { id: 24, name_zh: "大寒", name_en: "Major Cold", date: "Jan 20", description: "The coldest day of the year.", dietary_tip: "Eat rich, warming foods to store energy for spring.", lifestyle_tip: "Stay indoors and rest. Prepare for the coming spring." },
];

export function getCurrentSolarTerm(): SolarTerm {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  for (let i = solarTerms.length - 1; i >= 0; i--) {
    const [m, d] = solarTerms[i].date.split(" ");
    const monthNum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m) + 1;
    const dayNum = parseInt(d);
    if (month > monthNum || (month === monthNum && day >= dayNum)) {
      return solarTerms[i];
    }
  }
  return solarTerms[solarTerms.length - 1];
}
